import PropTypes from "prop-types";
import { useState } from "react";
import { Form, Button, Alert, CardTitle } from "react-bootstrap";

// Login component
const LoginRegister = ({ setAuth }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [showLogin, setShowLogin] = useState(true);
  const [error, setError] = useState("");

  const submitLogin = async (ev) => {
    ev.preventDefault();
    try {
      await login({ username, password });
    } catch (err) {
      setError("Authentication Failed, Username or password not found");
    }
  };

  const login = async (credentials) => {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const json = await response.json();
    if (response.ok) {
      window.localStorage.setItem("token", json.token);
      setAuth(json.user);
    } else {
      console.log(json);
      const error = await response.json();
      throw new Error(error.message);
    }
  };

  const submitRegister = async (ev) => {
    ev.preventDefault();

    try {
      await register({ username, password, email, phone });
    } catch (err) {
      if (err.response && err.response.status === 500) {
        setError("User or Email Already Registered");
      } else {
        setError("Error registering, please try again");
      }
    }
  };

  const register = async (credentials) => {
    const response = await fetch("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(credentials),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const json = await response.json();
    if (response.ok) {
      login({ username, password });
    } else {
      console.log(json);
      const error = await response.json();
      throw new Error(error.message);
    }
  };

  return (
    <div className="auth-form">
      {showLogin ? (
        <div>
          <Form onSubmit={submitLogin}>
            <CardTitle className="text-center">Login</CardTitle>
            <Form.Group controlId="formBasicEmail">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter username"
                value={username}
                onChange={(ev) => setUsername(ev.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Password"
                value={password}
                onChange={(ev) => setPassword(ev.target.value)}
              />
            </Form.Group>

            <Button
              variant="primary"
              type="submit"
              disabled={!username || !password}
            >
              Login
            </Button>
            <Button variant="link" onClick={() => setShowLogin(false)}>
              Register
            </Button>
          </Form>
          {error && <Alert variant="danger">{error}</Alert>}
        </div>
      ) : (
        <div>
          <Form onSubmit={submitRegister}>
            <CardTitle className="text-center">Register</CardTitle>
            <Form.Group controlId="formBasicEmail">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter username"
                value={username}
                onChange={(ev) => setUsername(ev.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Password"
                value={password}
                onChange={(ev) => setPassword(ev.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="formBasicEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={(ev) => setEmail(ev.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="formBasicPhone">
              <Form.Label>Phone Number</Form.Label>
              <Form.Control
                type="tel"
                placeholder="Enter phone number"
                value={phone}
                onChange={(ev) => setPhone(ev.target.value)}
              />
            </Form.Group>

            <Button
              variant="primary"
              type="submit"
              disabled={!username || !password || !email}
            >
              Register
            </Button>
            <Button variant="link" onClick={() => setShowLogin(true)}>
              Login
            </Button>
          </Form>
          {error && <Alert variant="danger">{error}</Alert>}
        </div>
      )}
      {error && <Alert variant="danger">{error}</Alert>}
    </div>
  );
};

LoginRegister.propTypes = {
  setAuth: PropTypes.func,
};

export default LoginRegister;
