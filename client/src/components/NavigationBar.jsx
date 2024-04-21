import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { Navbar, Nav, Button } from "react-bootstrap";
import LogoPicture from "../assets/logo.jpeg";

const NavigationBar = ({ auth, logout }) => {
  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Navbar.Brand className="Brandlogo" as={Link} to="/">
        <img
          src={LogoPicture}
          width="85"
          height="85"
          className="d-inline-block align-top"
          alt="Your E-commerce Website logo"
        />
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="mr-auto">
          <Nav.Link as={Link} to="/">
            Home
          </Nav.Link>
          {auth && auth.id ? (
            <>
              <Nav.Link as={Link} to="/cart">
                Cart
              </Nav.Link>
              <Nav.Link as={Link} to="/orders">
                Orders
              </Nav.Link>
              <Nav.Link as={Link} to="/profile">
                Profile
              </Nav.Link>
              <Button variant="primary" as={Link} to="/" className="mr-2">
                Return to Home
              </Button>
              <Button variant="danger" onClick={logout}>
                Logout
              </Button>
            </>
          ) : (
            <Button variant="primary" as={Link} to="/login">
              Login
            </Button>
          )}
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

NavigationBar.propTypes = {
  auth: PropTypes.shape({
    id: PropTypes.any,
  }),
  logout: PropTypes.any,
};

export default NavigationBar;

// import { Link } from "react-router-dom";

// const NavigationBar = ({ logout }) => {
//   return (
//     <nav className="navbar navbar-expand-lg navbar-light bg-light">
//       <Link className="navbar-brand" to="/">
//         Home
//       </Link>
//       <button
//         className="navbar-toggler"
//         type="button"
//         data-toggle="collapse"
//         data-target="#navbarNav"
//         aria-controls="navbarNav"
//         aria-expanded="false"
//         aria-label="Toggle navigation"
//       >
//         <span className="navbar-toggler-icon"></span>
//       </button>
//       <div className="collapse navbar-collapse" id="navbarNav">
//         <ul className="navbar-nav">
//           <li className="nav-item">
//             <Link className="nav-link" to="/cart">
//               Cart
//             </Link>
//           </li>
//           <li className="nav-item">
//             <Link className="nav-link" to="/profile">
//               Profile
//             </Link>
//           </li>
//           <li className="nav-item">
//             <button className="btn btn-link nav-link" onClick={logout}>
//               Logout
//             </button>
//           </li>
//         </ul>
//       </div>
//     </nav>
//   );
// };

// export default NavigationBar;
