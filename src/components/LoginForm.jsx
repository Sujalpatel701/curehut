import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

const LoginForm = () => {
  const [loginType, setLoginType] = useState("user"); // "user" or "doctor"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const toggleLoginType = () => {
    setError("");
    setLoginType(loginType === "user" ? "doctor" : "user");
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    if (!email || !password) {
      setError("Please fill all fields");
      return;
    }

    setLoading(true);
    try {
      const endpoint =
        loginType === "user"
          ? `${apiBaseUrl}/api/auth/login`
          : `${apiBaseUrl}/api/auth/doctor/login`;

      const res = await axios.post(endpoint, { email, password });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userEmail", email);
      localStorage.setItem("userType", loginType);

      alert(`${loginType === "user" ? "User" : "Doctor"} login successful!`);
      setLoading(false);

      // Redirect based on userType
      if (loginType === "user") {
        navigate("/profile");
      } else {
        navigate("/doctor-profile");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
      setLoading(false);
    }
  };

  return (
    <div style={containerStyle}>
      <h2 style={{ marginBottom: 20 }}>
        {loginType === "user" ? "User Login" : "Doctor Login"}
      </h2>

      <form onSubmit={handleLogin} style={formStyle}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={inputStyle}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={inputStyle}
          required
        />
        <button type="submit" disabled={loading} style={buttonStyle}>
          {loading ? "Logging in..." : "Login"}
        </button>
        {error && <p style={errorStyle}>{error}</p>}
      </form>

      <p
        style={{ marginTop: 20, cursor: "pointer", color: "#007bff" }}
        onClick={toggleLoginType}
      >
        {loginType === "user" ? "Login as Doctor" : "Login as User"}
      </p>
    </div>
  );
};

const containerStyle = {
  maxWidth: 400,
  margin: "40px auto",
  padding: 20,
  boxShadow: "0 0 10px rgba(0,0,0,0.1)",
  borderRadius: 8,
  textAlign: "center",
};

const formStyle = {
  display: "flex",
  flexDirection: "column",
};

const inputStyle = {
  marginBottom: 12,
  padding: 8,
  fontSize: 16,
};

const buttonStyle = {
  padding: 10,
  fontSize: 16,
  cursor: "pointer",
  backgroundColor: "#007bff",
  color: "white",
  border: "none",
  borderRadius: 4,
};

const errorStyle = {
  color: "red",
  marginTop: 10,
};

export default LoginForm;
