const {
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
} = require("./db");

const express = require("express");
const app = express();
app.use(express.json());

//for deployment only
const path = require("path");
app.get("/", (req, res) =>
  res.sendFile(path.join(__dirname, "../client/dist/index.html"))
);
app.use(
  "/assets",
  express.static(path.join(__dirname, "../client/dist/assets"))
);

const isLoggedIn = async (req, res, next) => {
  try {
    req.user = await findUserWithToken(req.headers.authorization);
    next();
  } catch (ex) {
    next(ex);
  }
};
// Login API
app.post("/api/auth/login", async (req, res, next) => {
  try {
    res.send(await authenticate(req.body));
  } catch (ex) {
    next(ex);
  }
});

app.get("/api/auth/me", isLoggedIn, async (req, res, next) => {
  try {
    res.send(await findUserWithToken(req.headers.authorization));
  } catch (ex) {
    next(ex);
  }
});
// For Users

app.get("/api/users", async (req, res, next) => {
  try {
    res.send(await fetchUsers());
  } catch (ex) {
    next(ex);
  }
});

app.post("/api/auth/register", async (req, res, next) => {
  try {
    res.send(await createUser(req.body));
  } catch (ex) {
    next(ex);
  }
});

// For Favorites

app.get("/api/users/:id/favorites", async (req, res, next) => {
  try {
    res.send(await fetchFavorites(req.params.id));
  } catch (ex) {
    next(ex);
  }
});

app.post("/api/users/:id/favorites", isLoggedIn, async (req, res, next) => {
  try {
    res.status(201).send(
      await createFavorite({
        user_id: req.params.id,
        product_id: req.body.product_id,
      })
    );
  } catch (ex) {
    next(ex);
  }
});

app.delete(
  "/api/users/:user_id/favorites/:id",
  isLoggedIn,
  async (req, res, next) => {
    try {
      await destroyFavorite({ user_id: req.params.user_id, id: req.params.id });
      res.sendStatus(204);
    } catch (ex) {
      next(ex);
    }
  }
);

// For Products

app.get("/api/products", async (req, res, next) => {
  try {
    res.send(await fetchProducts());
  } catch (ex) {
    next(ex);
  }
});

app.get("/api/products/:id", async (req, res, next) => {
  try {
    res.send(await fetchSingleProduct(req.params.id));
  } catch (ex) {
    next(ex);
  }
});

app.post("/api/admin/products", async (req, res, next) => {
  try {
    res.send(await createProduct(req.body));
  } catch (ex) {
    next(ex);
  }
});

app.put("/api/admin/products/:id", async (req, res, next) => {
  try {
    res.send(await updateProduct({ id: req.params.id, ...req.body }));
  } catch (ex) {
    next(ex);
  }
});

app.delete("/api/admin/products/:id", async (req, res, next) => {
  try {
    await destroyProduct(req.params.id);
    res.sendStatus(204);
  } catch (ex) {
    next(ex);
  }
});

// For Cart

app.delete("/api/users/:id/product/:productid", async (req, res, next) => {
  try {
    await removeFromCart({
      user_id: req.params.id,
      product_id: req.params.productid,
    });
    res.status(200).json({ message: "Item removed from cart" });
  } catch (ex) {
    next(ex);
  }
});
app.post("/api/users/:id/checkout", async (req, res, next) => {
  try {
    const { id } = req.params;
    const { cart, address } = req.body;
    const order = await checkout(id, address);
    const orderItems = await createOrderItems(order.id, cart);
    const totalPrice = await calculateTotalPrice(order.id);
    await updateOrderTotal(order.id, totalPrice);
    await clearCart(id); // clear the cart after checkout
    res.send({ ...order, orderItems, totalPrice });
  } catch (ex) {
    next(ex);
  }
});

app.post("/api/cart", async (req, res, next) => {
  try {
    const { user_id, product_id, quantity } = req.body; // destructure the properties here
    res.send(await createCartItem({ user_id, product_id, quantity }));
  } catch (ex) {
    next(ex);
  }
});
app.get("/api/users/:id/cart", async (req, res, next) => {
  try {
    const { id } = req.params;
    const cart = await fetchCart(id);
    res.send(cart);
  } catch (ex) {
    next(ex);
  }
});

app.get("/api/cart/total", async (req, res, next) => {
  try {
    res.send({ total: await fetchCartTotal(req.body.user_id) });
  } catch (ex) {
    next(ex);
  }
});
app.post("/api/users/:id/cart", async (req, res, next) => {
  try {
    const { id: user_id } = req.params; // rename id to user_id for clarity
    const { product_id, quantity } = req.body;
    const item = await addToCart({ user_id, product_id, quantity }); // pass an object here
    res.send(item);
  } catch (ex) {
    next(ex);
  }
});
app.put("/api/users/:id/cart", async (req, res, next) => {
  try {
    const { id: user_id } = req.params; // rename id to user_id for clarity
    const { product_id, quantity } = req.body; // pass an object here
    const item = await updateCart({ user_id, product_id, quantity });
    res.send(item);
  } catch (ex) {
    next(ex);
  }
});

// For Category

app.post("/api/categories", async (req, res, next) => {
  try {
    res.send(await createCategory(req.body));
  } catch (ex) {
    next(ex);
  }
});

app.get("/api/categories", async (req, res, next) => {
  try {
    res.send(await fetchCategories());
  } catch (ex) {
    next(ex);
  }
});

// For admin

const isAdmin = async (req, res, next) => {
  try {
    const user = await findUserWithToken(req.headers.authorization);
    if (!(await isAdmin2(user.id))) {
      throw new Error("Not authorized");
    }
    next();
  } catch (ex) {
    next(ex);
  }
};

app.use("/api/admin", isAdmin);

// For Orders
app.get("/api/users/:id/orders", async (req, res, next) => {
  try {
    const { id } = req.params;
    const orders = await fetchOrders(id);
    res.send(orders);
  } catch (ex) {
    next(ex);
  }
});

app.get("/api/orders/:id/items", async (req, res, next) => {
  try {
    res.send(await fetchOrderItems(req.params.id));
  } catch (ex) {
    next(ex);
  }
});

app.get("/api/orders/:id/total", async (req, res, next) => {
  try {
    res.send({ total: await fetchOrderTotal(req.params.id) });
  } catch (ex) {
    next(ex);
  }
});
// Reviews Products
app.get("/api/products/:id/reviews", async (req, res, next) => {
  try {
    res.send(await getReviews(req.params.id));
  } catch (ex) {
    next(ex);
  }
});
app.post("/api/products/:id/reviews", async (req, res, next) => {
  try {
    res.send(
      await createReview({
        userId: req.body.userId,
        productId: req.params.id,
        content: req.body.content,
        rating: req.body.rating,
      })
    );
  } catch (ex) {
    next(ex);
  }
});
app.delete("/api/products/:id/reviews/:reviewId", async (req, res, next) => {
  try {
    await deleteReview(req.params.reviewId);
    res.sendStatus(204);
  } catch (ex) {
    next(ex);
  }
});

// handle
app.use((err, req, res, next) => {
  console.log(err);
  res
    .status(err.status || 500)
    .send({ error: err.message ? err.message : err });
});

const init = async () => {
  const port = process.env.PORT || 3000;
  await client.connect();
  console.log("connected to database");

  await createTables();
  console.log("tables created");

  // Create categories
  const [electronics, clothing, home] = await Promise.all([
    createCategory({ name: "Electronics" }),
    createCategory({ name: "Clothing" }),
    createCategory({ name: "Home" }),
  ]);

  // Create products
  const [laptop, tshirt, chair] = await Promise.all([
    createProduct({
      name: "Laptop",
      price: 1000,
      quantity: 10,
      description: "A high quality laptop",
      image:
        "https://dailytwocents.com/wp-content/uploads/2019/12/Gaming-Laptop-2.jpg",
      category_id: electronics.id,
    }),
    createProduct({
      name: "T-Shirt",
      price: 20,
      quantity: 50,
      description: "A comfortable t-shirt",
      image:
        "https://i.etsystatic.com/12860790/r/il/18662e/2727406508/il_fullxfull.2727406508_nb9g.jpg",
      category_id: clothing.id,
    }),
    createProduct({
      name: "Chair",
      price: 70,
      quantity: 20,
      description: "A Gaming chair",
      image:
        "https://luxurylaunches.com/wp-content/uploads/2021/01/Razer-Gaming-Chair.jpg",
      category_id: home.id,
    }),
    createProduct({
      name: "TV",
      price: 2000,
      quantity: 15,
      description: "100 inches OLED TV",
      image:
        "https://assets.hardwarezone.com/img/2023/01/OLED-EVO_Product_04.jpg",
      category_id: home.id,
    }),
  ]);

  // Create users
  const [moe, lucy, admin] = await Promise.all([
    createUser({
      username: "moe",
      password: "123456",
      email: "moe@example.com",
      phone: "123-456-7890",
      is_admin: false,
    }),
    createUser({
      username: "lucy",
      password: "123457",
      email: "lucy@example.com",
      phone: "123-456-7891",
      is_admin: false,
    }),
    createUser({
      username: "admin",
      password: "admin123",
      email: "admin@example.com",
      phone: "123-456-7892",
      is_admin: true,
    }),
  ]);

  // Add products to cart
  await Promise.all([
    addToCart({ user_id: moe.id, product_id: laptop.id, quantity: 1 }),
    addToCart({ user_id: lucy.id, product_id: tshirt.id, quantity: 2 }),
  ]);

  // Add products to favorites
  await Promise.all([
    createFavorite({ user_id: moe.id, product_id: chair.id }),
    createFavorite({ user_id: lucy.id, product_id: laptop.id }),
  ]);

  app.listen(port, () => console.log(`listening on port ${port}`));
};

init();

// // Add products to cart
// await Promise.all([
//   addToCart({ user_id: moe.id, product_id: products[0].id, quantity: 1 }),
//   addToCart({ user_id: lucy.id, product_id: products[1].id, quantity: 2 }),
// ]);

// // Add products to favorites
// await Promise.all([
//   createFavorite({ user_id: moe.id, product_id: products[2].id }),
//   createFavorite({ user_id: lucy.id, product_id: products[3].id }),
// ]);

// // Create products
// const products = [];
// for (let i = 0; i < 50; i++) { // change 50 to the number of products you want to create
//   const product = await createProduct({
//     name: `Product ${i}`,
//     price: Math.floor(Math.random() * 1000),
//     quantity: Math.floor(Math.random() * 100),
//     description: `This is product ${i}`,
//     image: "https://example.com/product.jpg", // replace with your image URL
//     category_id: [electronics.id, clothing.id, home.id][Math.floor(Math.random() * 3)],
//   });
//   products.push(product);
// }
