import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

const DoctorSignupForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    specialization: "",
    licenseNumber: "",
    hospital: "",
  });
  const [step, setStep] = useState(1); // 1: Signup, 2: OTP Verification
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");
    setLoading(true);

    try {
      const res = await axios.post(`${apiBaseUrl}/api/auth/doctor/signup`, formData);
      localStorage.setItem("tempDoctorEmail", formData.email);
      setLoading(false);
      setStep(2);
      setSuccessMessage("OTP sent successfully to your email.");
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed");
      setLoading(false);
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");
    setLoading(true);

    try {
      const res = await axios.post(`${apiBaseUrl}/api/auth/doctor/verify`, {
        email: localStorage.getItem("tempDoctorEmail"),
        otp,
      });
      localStorage.removeItem("tempDoctorEmail");
      localStorage.setItem("userEmail", res.data.email);
      localStorage.setItem("userType", "doctor");
      setLoading(false);
      setSuccessMessage("Signup completed successfully!");
      // Redirect after a short delay so user can see message
      setTimeout(() => {
        navigate("/doctor-profile");
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Verification failed");
      setLoading(false);
    }
  };

  return (
    <div style={containerStyle}>
      {step === 1 ? (
        <>
          <h2 style={headerStyle}>Doctor Sign Up</h2>
          <form onSubmit={handleSubmit} style={formStyle}>
            {/* ... all your input fields here ... */}
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              style={inputStyle}
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              style={inputStyle}
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              style={inputStyle}
              required
            />
            <input
              type="text"
              name="phone"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleChange}
              style={inputStyle}
              required
            />
            <input
              type="text"
              name="specialization"
              placeholder="Specialization"
              value={formData.specialization}
              onChange={handleChange}
              style={inputStyle}
              required
            />
            <input
              type="text"
              name="licenseNumber"
              placeholder="Medical License Number"
              value={formData.licenseNumber}
              onChange={handleChange}
              style={inputStyle}
              required
            />
            <input
              type="text"
              name="hospital"
              placeholder="Hospital/Clinic"
              value={formData.hospital}
              onChange={handleChange}
              style={inputStyle}
              required
            />
            <button type="submit" disabled={loading} style={buttonStyle}>
              {loading ? "Signing up..." : "Sign Up"}
            </button>
            {error && <p style={errorStyle}>{error}</p>}
            {successMessage && <p style={successStyle}>{successMessage}</p>}
          </form>
        </>
      ) : (
        <>
          <h2 style={headerStyle}>Verify OTP</h2>
          <p style={{ textAlign: "center", marginBottom: "20px" }}>
            We've sent an OTP to your email. Please enter it below.
          </p>
          <form onSubmit={handleVerify} style={formStyle}>
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              style={inputStyle}
              required
            />
            <button type="submit" disabled={loading} style={buttonStyle}>
              {loading ? "Verifying..." : "Verify"}
            </button>
            {error && <p style={errorStyle}>{error}</p>}
            {successMessage && <p style={successStyle}>{successMessage}</p>}
          </form>
        </>
      )}
    </div>
  );
};

// Style objects
const containerStyle = {
  maxWidth: 400,
  margin: "40px auto",
  padding: 20,
  boxShadow: "0 0 10px rgba(0,0,0,0.1)",
  borderRadius: 8,
  textAlign: "center",
};

const headerStyle = {
  marginBottom: 20,
  fontSize: "24px",
};

const formStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "12px",
};

const inputStyle = {
  padding: "10px",
  fontSize: "16px",
  borderRadius: "4px",
  border: "1px solid #ccc",
};

const buttonStyle = {
  padding: "10px",
  fontSize: "16px",
  borderRadius: "4px",
  border: "none",
  backgroundColor: "#007bff",
  color: "white",
  cursor: "pointer",
};

const errorStyle = {
  color: "red",
  marginTop: "10px",
};

const successStyle = {
  color: "green",
  marginTop: "10px",
};

export default DoctorSignupForm;
