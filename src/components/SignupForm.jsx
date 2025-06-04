import React, { useState } from "react";
import axios from "axios";

const SignupForm = () => {
  const [step, setStep] = useState("signup"); // signup | otp | success
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
    insuranceCompany: "",
    insuranceId: "",
  });
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL; // <--- get base URL from env

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (
      !form.name ||
      !form.phone ||
      !form.email ||
      !form.password ||
      !form.insuranceCompany ||
      form.insuranceId.length !== 10
    ) {
      setError("Please fill all fields correctly. Insurance ID must be 10 digits.");
      return;
    }

    setLoading(true);
    try {
      await axios.post(`${API_BASE_URL}/api/auth/register`, form);
      alert("Registered! Check your email for OTP.");
      setLoading(false);
      setStep("otp");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
      setLoading(false);
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!otp.trim()) {
      setError("Please enter the OTP.");
      return;
    }

    setLoading(true);
    try {
      await axios.post(`${API_BASE_URL}/api/auth/verify`, {
        email: form.email,
        otp,
      });

      setLoading(false);
      setStep("success");
    } catch (err) {
      setError(err.response?.data?.message || "OTP verification failed");
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "auto", padding: 20 }}>
      {step === "signup" && (
        <form onSubmit={handleSignupSubmit} style={formStyle}>
          <h2>Sign Up</h2>
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
            style={inputStyle}
          />
          <input
            type="text"
            name="phone"
            placeholder="Phone Number"
            value={form.phone}
            onChange={handleChange}
            style={inputStyle}
          />
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={form.email}
            onChange={handleChange}
            style={inputStyle}
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            style={inputStyle}
          />
          <input
            type="text"
            name="insuranceCompany"
            placeholder="Insurance Company"
            value={form.insuranceCompany}
            onChange={handleChange}
            style={inputStyle}
          />
          <input
            type="text"
            name="insuranceId"
            placeholder="Insurance ID (10 digits)"
            value={form.insuranceId}
            onChange={handleChange}
            maxLength={10}
            style={inputStyle}
          />
          <button type="submit" disabled={loading} style={buttonStyle}>
            {loading ? "Registering..." : "Sign Up"}
          </button>
          {error && <p style={{ color: "red" }}>{error}</p>}
        </form>
      )}

      {step === "otp" && (
        <form onSubmit={handleOtpSubmit} style={formStyle}>
          <h2>Verify OTP</h2>
          <p>Enter the OTP sent to <b>{form.email}</b></p>
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            style={inputStyle}
          />
          <button type="submit" disabled={loading} style={buttonStyle}>
            {loading ? "Verifying..." : "Verify OTP"}
          </button>
          {error && <p style={{ color: "red" }}>{error}</p>}
        </form>
      )}

      {step === "success" && (
        <div style={{ textAlign: "center" }}>
          <h2>Registration Successful!</h2>
          <p>Your email has been verified. You can now log in.</p>
        </div>
      )}
    </div>
  );
};

const formStyle = {
  display: "flex",
  flexDirection: "column",
  gap: 12,
};

const inputStyle = {
  padding: 8,
  fontSize: 16,
};

const buttonStyle = {
  padding: 10,
  fontSize: 16,
  cursor: "pointer",
};

export default SignupForm;
