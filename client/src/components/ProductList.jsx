import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { useState } from "react";
import {
  Card,
  Button,
  Dropdown,
  FormControl,
  InputGroup,
  Container,
  Row,
  Col,
  Form,
} from "react-bootstrap";

const ProductList = ({
  removeFavorite,
  removeFromCart,
  addFavorite,
  addToCart,
  products,
  favorites,
  cartisLoading,
  cart,
  auth,
}) => {
  const [sortKey, setSortKey] = useState("");
  const [filterKey, setFilterKey] = useState("");
  const [filterValue, setFilterValue] = useState("");

  const isAddedtoCart = (product_id) => {
    return !!cart.find((item) => item.product_id === product_id);
  };

  let sortedProducts = [...products];
  if (sortKey) {
    sortedProducts.sort((a, b) => (a[sortKey] > b[sortKey] ? 1 : -1));
  }

  let filteredProducts = [...sortedProducts];
  if (filterKey && filterValue) {
    if (filterKey === "price") {
      filteredProducts = filteredProducts.filter(
        (product) => product[filterKey] <= filterValue
      );
    } else {
      filteredProducts = filteredProducts.filter((product) =>
        product[filterKey].toLowerCase().includes(filterValue.toLowerCase())
      );
    }
  }

  return (
    <Container>
      {/* <h1>Products</h1> */}
      <InputGroup className="m-3">
        <Dropdown onSelect={(e) => setSortKey(e)}>
          <Dropdown.Toggle variant="outline-secondary" id="dropdown-basic">
            Sort by
          </Dropdown.Toggle>

          <Dropdown.Menu>
            <Dropdown.Item eventKey="name">Name</Dropdown.Item>
            <Dropdown.Item eventKey="price">Price</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
        <Dropdown onSelect={(e) => setFilterKey(e)}>
          <Dropdown.Toggle variant="outline-secondary" id="dropdown-basic">
            Filter by
          </Dropdown.Toggle>

          <Dropdown.Menu>
            <Dropdown.Item eventKey="name">Name</Dropdown.Item>
            <Dropdown.Item eventKey="price">Price</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
        {filterKey &&
          (filterKey === "price" ? (
            <FormControl
              type="range"
              min="0"
              max="1000"
              value={filterValue}
              onChange={(e) => setFilterValue(e.target.value)}
            />
          ) : (
            <FormControl
              type="text"
              placeholder="Filter Value"
              value={filterValue}
              onChange={(e) => setFilterValue(e.target.value)}
            />
          ))}
      </InputGroup>
      <Row>
        {filteredProducts.map((product) => {
          const isFavorite = favorites.find(
            (favorite) => favorite.product_id === product.id
          );
          return (
            <Col sm={12} md={6} lg={4} xl={3} key={product.id}>
              <Card className={isFavorite ? "favorite" : ""}>
                <Card.Img
                  variant="top"
                  src={product.image}
                  alt={product.name}
                />
                <Card.Body>
                  <Card.Title>{product.name}</Card.Title>
                  <Card.Text>Price: ${product.price}</Card.Text>
                  {auth.id && (
                    <div>
                      <Form.Group controlId="formBasicQuantity">
                        <Form.Label>Quantity</Form.Label>
                        <Form.Control type="number" min="1" defaultValue="1" />
                      </Form.Group>
                      <Form.Group controlId="formBasicSize">
                        <Form.Label>Size</Form.Label>
                        <Form.Control as="select">
                          <option>S</option>
                          <option>M</option>
                          <option>L</option>
                          <option>XL</option>
                        </Form.Control>
                      </Form.Group>
                      {isAddedtoCart(product.id) ? (
                        <Button
                          variant="danger"
                          onClick={() => removeFromCart(product.id)}
                        >
                          Remove from Cart
                        </Button>
                      ) : (
                        <Button
                          variant="primary"
                          disabled={cartisLoading}
                          onClick={() => addToCart(product.id)}
                        >
                          Add to Cart
                        </Button>
                      )}
                      {isFavorite ? (
                        <Button
                          variant="outline-primary"
                          onClick={() => removeFavorite(isFavorite.id)}
                        >
                          Remove Favorite
                        </Button>
                      ) : (
                        <Button
                          variant="outline-primary"
                          onClick={() => addFavorite(product.id)}
                        >
                          Add Favorite
                        </Button>
                      )}
                      <Link to={`/product/${product.id}`}>
                        <Button variant="info">View Details</Button>
                      </Link>
                    </div>
                  )}
                </Card.Body>
              </Card>
            </Col>
          );
        })}
      </Row>
    </Container>
  );
};

ProductList.propTypes = {
  addFavorite: PropTypes.func,
  addToCart: PropTypes.func,
  auth: PropTypes.shape({
    id: PropTypes.any,
  }),
  cart: PropTypes.array,
  cartisLoading: PropTypes.bool,
  favorites: PropTypes.array,
  products: PropTypes.array,
  removeFavorite: PropTypes.func,
  removeFromCart: PropTypes.func,
};

export default ProductList;
