import PropTypes from "prop-types";
import { useState } from "react";

// Login component
const LoginRegister = ({ setAuth }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [showLogin, setShowLogin] = useState(true);

  const submitLogin = (ev) => {
    ev.preventDefault();
    login({ username, password });
    // console.log(username, password);
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
      // setError(err.message);
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
    console.log(json);
    if (response.ok) {
      login({ username, password });
    } else {
      console.log(json);
    }
  };

  return (
    <div>
      {showLogin ? (
        <div>
          <h2>Login</h2>
          <form>
            <input
              value={username}
              placeholder="username"
              onChange={(ev) => setUsername(ev.target.value)}
            />
            <input
              value={password}
              placeholder="password"
              onChange={(ev) => setPassword(ev.target.value)}
            />
            <button disabled={!username || !password} onClick={submitLogin}>
              Login
            </button>
          </form>
          <button onClick={() => setShowLogin(false)}>Register</button>
        </div>
      ) : (
        <div>
          <h2>Register</h2>
          <form>
            <input
              value={username}
              placeholder="username"
              onChange={(ev) => setUsername(ev.target.value)}
            />
            <input
              value={password}
              placeholder="password"
              onChange={(ev) => setPassword(ev.target.value)}
            />
            <input
              value={email}
              placeholder="email"
              onChange={(ev) => setEmail(ev.target.value)}
            />
            <input
              value={phone}
              placeholder="phone"
              onChange={(ev) => setPhone(ev.target.value)}
            />
            <button
              disabled={!username || !password || !email}
              onClick={submitRegister}
            >
              Register
            </button>
          </form>
          <button onClick={() => setShowLogin(true)}>Login</button>
        </div>
      )}
    </div>
  );
};

LoginRegister.propTypes = {
  setAuth: PropTypes.func,
};

export default LoginRegister;
