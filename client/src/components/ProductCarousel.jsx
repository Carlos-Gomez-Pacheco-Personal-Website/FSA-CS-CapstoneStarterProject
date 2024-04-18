import PropTypes from "prop-types";
import { Carousel } from "react-bootstrap";
import { useLocation } from "react-router-dom";

const ConditionalCarousel = ({ children }) => {
  const location = useLocation();
  if (location.pathname !== "/") {
    return null;
  }
  return children;
};

ConditionalCarousel.propTypes = {
  children: PropTypes.node.isRequired,
};

const ProductCarousel = () => {
  return (
    <ConditionalCarousel>
      <Carousel>
        <Carousel.Item>
          <img
            className="d-block w-100"
            src="https://www.riadmehdi.net/wp-content/uploads/2017/07/cell-phone-website-home-1.jpg"
            alt="First slide"
          />
          <Carousel.Caption>
            <h3>First slide label</h3>
            <p>Nulla vitae elit libero, a pharetra augue mollis interdum.</p>
          </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item>
          <img
            className="d-block w-100"
            src="https://aogdesign.com.au/wp-content/uploads/2022/02/ecommerce-website-shopping-image.jpg"
            alt="Second slide"
          />

          <Carousel.Caption>
            <h3>Second slide label</h3>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
          </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item>
          <img
            className="d-block w-100"
            src="https://iexperto.io/wp-content/uploads/2022/04/eCommerce-Website-Design.jpg"
            alt="Third slide"
          />

          <Carousel.Caption>
            <h3>Third slide label</h3>
            <p>
              Praesent commodo cursus magna, vel scelerisque nisl consectetur.
            </p>
          </Carousel.Caption>
        </Carousel.Item>
      </Carousel>
    </ConditionalCarousel>
  );
};

export default ProductCarousel;
