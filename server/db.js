const pg = require("pg");
const client = new pg.Client(
  process.env.DATABASE_URL || "postgres://localhost/Market_auth_store_db"
);
const uuid = require("uuid");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const JWT = process.env.JWT || "shhh";

const createTables = async () => {
  const SQL = `
    DROP TABLE IF EXISTS order_items;
    DROP TABLE IF EXISTS reviews;
    DROP TABLE IF EXISTS favorites;
    DROP TABLE IF EXISTS cart;
    DROP TABLE IF EXISTS orders;
    DROP TABLE IF EXISTS products;
    DROP TABLE IF EXISTS users;
    DROP TABLE IF EXISTS categories;

    CREATE TABLE users(
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      username VARCHAR(20) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      phone VARCHAR(20),
      is_admin BOOLEAN DEFAULT false
    );

    CREATE TABLE categories(
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      name VARCHAR(20) UNIQUE NOT NULL
    );

    CREATE TABLE products(
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      name VARCHAR(20) NOT NULL,
      price NUMERIC NOT NULL,
      quantity INTEGER NOT NULL,
      description TEXT,
      image TEXT,
      category_id UUID REFERENCES categories(id)
    );

    CREATE TABLE cart(
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID REFERENCES users(id) NOT NULL,
      product_id UUID REFERENCES products(id) NOT NULL,
      quantity INTEGER NOT NULL
    );

    CREATE TABLE favorites(
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID REFERENCES users(id) NOT NULL,
      product_id UUID REFERENCES products(id) NOT NULL
    );

    CREATE TABLE orders(
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID REFERENCES users(id) NOT NULL,
      order_date TIMESTAMP NOT NULL,
      street VARCHAR(255),
      apartment VARCHAR(255),
      city VARCHAR(255),
      state VARCHAR(255),
      zip_code VARCHAR(255),
      total_price NUMERIC
    );

    CREATE TABLE order_items(
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      order_id UUID REFERENCES orders(id) NOT NULL,
      product_id UUID REFERENCES products(id) NOT NULL,
      quantity INTEGER NOT NULL
    );

    CREATE TABLE reviews(
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID REFERENCES users(id) NOT NULL,
      product_id UUID REFERENCES products(id) NOT NULL,
      content TEXT NOT NULL,
      rating INTEGER NOT NULL
    );
  `;
  await client.query(SQL);
};

//User
const createUser = async ({ username, password, email, phone }) => {
  const SQL = `
    INSERT INTO users(id, username, password, email, phone) VALUES($1, $2, $3, $4, $5) RETURNING *
  `;
  const response = await client.query(SQL, [
    uuid.v4(),
    username,
    await bcrypt.hash(password, 5),
    email,
    phone,
  ]);
  return {
    id: response.rows[0].id,
    username: response.rows[0].username,
    email: response.rows[0].email,
    phone: response.rows[0].phone,
  };
};

const authenticate = async ({ username, password }) => {
  if (!username || !password) {
    const error = Error("not authorized, missing username or password");
    error.status = 401;
    throw error;
  }
  const SQL = `
    SELECT id, password, username, phone, email 
    FROM users
    WHERE username=$1;
  `;
  const response = await client.query(SQL, [username]);
  console.log(response.rows);
  if (
    (!response.rows.length ||
      (await bcrypt.compare(password, response.rows[0].password))) === false
  ) {
    const error = Error("not authorized");
    error.status = 401;
    throw error;
  }
  const token = await jwt.sign({ id: response.rows[0].id }, JWT);
  return {
    token: token,
    user: {
      id: response.rows[0].id,
      username: response.rows[0].username,
      email: response.rows[0].email,
      phone: response.rows[0].phone,
    },
  };
};

const findUserWithToken = async (token) => {
  let id;
  try {
    const payload = await jwt.verify(token, JWT);
    id = payload.id;
  } catch (ex) {
    const error = Error("not authorized");
    error.status = 401;
    throw error;
  }
  const SQL = `
    SELECT id, username, email, phone
     FROM users WHERE id=$1;
  `;
  const response = await client.query(SQL, [id]);
  if (!response.rows.length) {
    const error = Error("not authorized");
    error.status = 401;
    throw error;
  }
  return response.rows[0];
};

const fetchUsers = async () => {
  const SQL = `
    SELECT id, username FROM users;
  `;
  const response = await client.query(SQL);
  return response.rows;
};

// Favorite
const fetchFavorites = async (user_id) => {
  const SQL = `
    SELECT * FROM favorites where user_id = $1
  `;
  const response = await client.query(SQL, [user_id]);
  return response.rows;
};

const createFavorite = async ({ user_id, product_id }) => {
  const SQL = `
    INSERT INTO favorites(id, user_id, product_id) VALUES($1, $2, $3) RETURNING *
  `;
  const response = await client.query(SQL, [uuid.v4(), user_id, product_id]);
  return response.rows[0];
};

const destroyFavorite = async ({ user_id, id }) => {
  const SQL = `
    DELETE FROM favorites WHERE user_id=$1 AND id=$2
  `;
  await client.query(SQL, [user_id, id]);
};

// Products
const fetchProducts = async () => {
  const SQL = `
    SELECT * FROM products;
  `;
  const response = await client.query(SQL);
  return response.rows;
};

const fetchSingleProduct = async (productId) => {
  const SQL = `
  SELECT * FROM products WHERE id = $1
  `;
  const response = await client.query(SQL, [productId]);
  return response.rows[0];
};

const updateProduct = async ({
  id,
  name,
  price,
  quantity,
  description,
  category_id,
}) => {
  const SQL = `
    UPDATE products
    SET name = $2, price = $3, quantity = $4, description = $5, category_id = $6
    WHERE id = $1
    RETURNING *
  `;
  const response = await client.query(SQL, [
    id,
    name,
    price,
    quantity,
    description,
    category_id,
  ]);
  return response.rows[0];
};

const createProduct = async ({
  name,
  price,
  quantity,
  description,
  image,
  category_id,
}) => {
  const SQL = `
    INSERT INTO products(id, name, price, quantity, description, image, category_id) VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING *
  `;
  const response = await client.query(SQL, [
    uuid.v4(),
    name,
    price,
    quantity,
    description,
    image,
    category_id,
  ]);
  return response.rows[0];
};

const destroyProduct = async (product_id) => {
  const SQL = `
    DELETE FROM products WHERE id = $1
  `;
  await client.query(SQL, [product_id]);
};

// Category
const createCategory = async ({ name }) => {
  const SQL = `
    INSERT INTO categories(id, name) VALUES($1, $2) RETURNING *
  `;
  const response = await client.query(SQL, [uuid.v4(), name]);
  return response.rows[0];
};

const fetchCategories = async () => {
  const SQL = `
    SELECT * FROM categories
  `;
  const response = await client.query(SQL);
  return response.rows;
};

// Cart
const addToCart = async ({ user_id, product_id, quantity }) => {
  console.log("addToCart", quantity);
  const SQL = `
    INSERT INTO cart(id, user_id, product_id, quantity) VALUES($1, $2, $3, $4) RETURNING *
  `;
  const response = await client.query(SQL, [
    uuid.v4(),
    user_id,
    product_id,
    quantity,
  ]);
  console.log(response.rows);
  return response.rows[0];
};

const removeFromCart = async ({ user_id, product_id }) => {
  const SQL = `
    DELETE FROM cart WHERE user_id=$1 AND product_id=$2
  `;
  await client.query(SQL, [user_id, product_id]);
};

const checkout = async (user_id) => {
  const SQL = `
    INSERT INTO orders(id, user_id, order_date) VALUES($1, $2, NOW()) RETURNING *
  `;
  const response = await client.query(SQL, [uuid.v4(), user_id]);
  return response.rows[0];
};

const clearCart = async (user_id) => {
  const SQL = `
    DELETE FROM cart WHERE user_id = $1
  `;
  await client.query(SQL, [user_id]);
};

// const checkout = async (user_id, address, totalPrice) => {
//   const SQL = `
//     INSERT INTO orders(id, user_id, order_date, street, apartment, city, state, zip_code, total_price)
//     VALUES($1, $2, NOW(), $3, $4, $5, $6, $7, $8) RETURNING *
//   `;
//   const response = await client.query(SQL, [
//     uuid.v4(),
//     user_id,
//     address.street,
//     address.apartment,
//     address.city,
//     address.state,
//     address.zipCode,
//     totalPrice,
//   ]);
//   return response.rows[0];
// };

const createCartItem = async ({ user_id, product_id, quantity }) => {
  const SQL = `
    INSERT INTO cart(id, user_id, product_id, quantity) VALUES($1, $2, $3, $4) RETURNING *
  `;
  const response = await client.query(SQL, [
    uuid.v4(),
    user_id,
    product_id,
    quantity,
  ]);
  return response.rows[0];
};

const updateCart = async ({ user_id, product_id, quantity }) => {
  const SQL = `
    UPDATE cart
    SET quantity = $3
    WHERE user_id = $1 AND product_id = $2
    RETURNING *
  `;
  const response = await client.query(SQL, [user_id, product_id, quantity]);
  return response.rows[0];
};

const fetchCart = async (user_id) => {
  const SQL = `
    SELECT c.*, p.name , p.price , c.quantity
    FROM cart c
    JOIN products p ON p.id = c.product_id
    WHERE c.user_id = $1
  `;
  const response = await client.query(SQL, [user_id]);
  console.log(response.rows);
  return response.rows.map((row) => ({
    ...row,
  }));
};

const fetchCartTotal = async (user_id) => {
  const SQL = `
    SELECT SUM(p.price * c.quantity) as total
    FROM cart c
    JOIN products p ON p.id = c.product_id
    WHERE c.user_id = $1
  `;
  const response = await client.query(SQL, [user_id]);
  return response.rows[0].total;
};

// Administrator

const isAdmin2 = async (user_id) => {
  const SQL = `
    SELECT is_admin FROM users WHERE id = $1
  `;
  const response = await client.query(SQL, [user_id]);
  return response.rows[0].is_admin;
};

// Orders
const fetchOrders = async (user_id) => {
  const SQL = `
  SELECT o.*, COALESCE(array_agg(oi) FILTER (WHERE oi.id IS NOT NULL), '{}') as order_items
  FROM orders o
  LEFT JOIN order_items oi ON o.id = oi.order_id
  WHERE o.user_id = $1
  GROUP BY o.id;
  `;
  const response = await client.query(SQL, [user_id]);
  return response.rows;
};
// const fetchOrders = async (user_id) => {
//   const SQL = `
//     SELECT * FROM orders WHERE user_id = $1
//   `;
//   const response = await client.query(SQL, [user_id]);
//   return response.rows;
// };

const fetchOrderItems = async (order_id) => {
  const SQL = `
    SELECT * FROM order_items WHERE order_id = $1
  `;
  const response = await client.query(SQL, [order_id]);
  return response.rows;
};

const fetchOrderTotal = async (order_id) => {
  const SQL = `
    SELECT SUM(p.price * oi.quantity) as total
    FROM order_items oi
    JOIN products p ON p.id = oi.product_id
    WHERE oi.order_id = $1
  `;
  const response = await client.query(SQL, [order_id]);
  return response.rows[0].total;
};

const createOrderItems = async (order_id, cart) => {
  const SQL = `
    INSERT INTO order_items(id, order_id, product_id, quantity)
    VALUES ($1, $2, $3, $4)
  `;
  const orderItems = [];
  for (let item of cart) {
    const response = await client.query(SQL, [
      uuid.v4(),
      order_id,
      item.product_id,
      item.quantity,
    ]);
    orderItems.push(response.rows[0]);
  }
  return orderItems;
};

const calculateTotalPrice = async (order_id) => {
  const SQL = `
    SELECT SUM(p.price * oi.quantity) as total
    FROM order_items oi
    JOIN products p ON p.id = oi.product_id
    WHERE oi.order_id = $1
  `;
  const response = await client.query(SQL, [order_id]);
  return response.rows[0].total;
};

const updateOrderTotal = async (order_id, total_price) => {
  const SQL = `
    UPDATE orders SET total_price = $2 WHERE id = $1
  `;
  await client.query(SQL, [order_id, total_price]);
};

// Review Product

const getReviews = async (productId) => {
  const SQL = `SELECT * FROM reviews WHERE product_id = $1`;
  const reviews = await client.query(SQL, [productId]);
  return reviews.rows;
};

const createReview = async ({ userId, productId, content, rating }) => {
  const SQL = `INSERT INTO reviews (user_id, product_id, content, rating) VALUES ($1, $2, $3, $4) RETURNING *`;
  const review = await client.query(SQL, [userId, productId, content, rating]);
  return review.rows[0];
};

const deleteReview = async (reviewId) => {
  const SQL = `DELETE FROM reviews WHERE id = $1`;
  await client.query(SQL, [reviewId]);
};

module.exports = {
  client,
  createTables,
  createUser,
  createProduct,
  createCategory,
  fetchCategories,
  addToCart,
  removeFromCart,
  checkout,
  updateProduct,
  fetchSingleProduct,
  destroyProduct,
  updateCart,
  isAdmin2,
  createCartItem,
  fetchCart,
  fetchCartTotal,
  fetchOrders,
  fetchOrderItems,
  fetchOrderTotal,
  fetchUsers,
  fetchProducts,
  fetchFavorites,
  createFavorite,
  destroyFavorite,
  authenticate,
  findUserWithToken,
  getReviews,
  createReview,
  deleteReview,
  clearCart,
  createOrderItems,
  updateOrderTotal,
  calculateTotalPrice,
};
