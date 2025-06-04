import React, { useState } from "react";
import LoginForm from "../components/LoginForm";
import SignupForm from "../components/SignupForm"; // Now using your existing SignupForm
import DoctorSignupForm from "../components/DoctorSignupForm";

const AuthPage = () => {
  const [authType, setAuthType] = useState("login"); // 'login', 'patient-signup', 'doctor-signup'

  return (
    <div style={containerStyle}>
      <div style={toggleStyle}>
        <button
          onClick={() => setAuthType("login")}
          style={authType === "login" ? activeBtnStyle : btnStyle}
        >
          Login
        </button>
        <button
          onClick={() => setAuthType("patient-signup")}
          style={authType === "patient-signup" ? activeBtnStyle : btnStyle}
        >
          Patient Sign Up
        </button>
        <button
          onClick={() => setAuthType("doctor-signup")}
          style={authType === "doctor-signup" ? activeBtnStyle : btnStyle}
        >
          Doctor Sign Up
        </button>
      </div>

      <div style={formContainerStyle}>
        {authType === "login" && <LoginForm />}
        {authType === "patient-signup" && <SignupForm />}
        {authType === "doctor-signup" && <DoctorSignupForm />}
        
        {authType === "login" && (
          <div style={signupLinksStyle}>
            <p>
              New here? Sign up as{' '}
              <span onClick={() => setAuthType("patient-signup")} style={linkStyle}>
                Patient
              </span>{' '}
              or{' '}
              <span onClick={() => setAuthType("doctor-signup")} style={linkStyle}>
                Doctor
              </span>
            </p>
          </div>
        )}
      </div>
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

const toggleStyle = {
  display: "flex",
  justifyContent: "center",
  marginBottom: 20,
};

const btnStyle = {
  flex: 1,
  padding: 10,
  fontSize: 16,
  cursor: "pointer",
  backgroundColor: "#f0f0f0",
  border: "1px solid #ccc",
  outline: "none",
};

const activeBtnStyle = {
  ...btnStyle,
  backgroundColor: "#007bff",
  color: "white",
  fontWeight: "bold",
};

const formContainerStyle = {
  textAlign: "left",
};

const signupLinksStyle = {
  marginTop: "20px",
  textAlign: "center",
  fontSize: "14px",
};

const linkStyle = {
  color: "#007bff",
  textDecoration: "none",
  cursor: "pointer",
  fontWeight: "bold",
};

export default AuthPage;