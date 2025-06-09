import React, { useState } from "react";
import LoginForm from "../components/LoginForm";
import SignupForm from "../components/SignupForm";
import DoctorSignupForm from "../components/DoctorSignupForm";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "./AuthPage.css";

const AuthPage = () => {
  const [authType, setAuthType] = useState("login");

  return (
    <>
      <Header />
      <div className="auth-container">
        <h1 className="auth-title">Welcome to CureHut</h1>
        <p className="auth-subtitle">
          {authType === "login" 
            ? "Login to access your health dashboard" 
            : "Join us to start your healthcare journey"}
        </p>

        <div className="auth-toggle">
          <button
            onClick={() => setAuthType("login")}
            className={`auth-btn ${authType === "login" ? "active" : ""}`}
          >
            Login
          </button>
          <button
            onClick={() => setAuthType("patient-signup")}
            className={`auth-btn ${authType === "patient-signup" ? "active" : ""}`}
          >
            Patient Sign Up
          </button>
          <button
            onClick={() => setAuthType("doctor-signup")}
            className={`auth-btn ${authType === "doctor-signup" ? "active" : ""}`}
          >
            Doctor Sign Up
          </button>
        </div>

        <div className="auth-form-container">
          {authType === "login" && <LoginForm />}
          {authType === "patient-signup" && <SignupForm />}
          {authType === "doctor-signup" && <DoctorSignupForm />}
          
          {authType === "login" && (
            <div className="auth-signup-links">
              <p>
                New here? Sign up as{' '}
                <span 
                  onClick={() => setAuthType("patient-signup")} 
                  className="auth-link"
                >
                  Patient
                </span>{' '}
                or{' '}
                <span 
                  onClick={() => setAuthType("doctor-signup")} 
                  className="auth-link"
                >
                  Doctor
                </span>
              </p>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default AuthPage;