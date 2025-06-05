import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
// Correct relative import path
import DoctorArticleForm from "../components/DoctorArticleForm";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

const DoctorProfile = () => {
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userType");
    navigate("/");
  };

  useEffect(() => {
    const fetchDoctorProfile = async () => {
      const email = localStorage.getItem("userEmail");

      if (!email) {
        setError("No doctor logged in.");
        setLoading(false);
        navigate("/");
        return;
      }

      try {
        const res = await axios.get(`${apiBaseUrl}/api/doctor/${email}`);
        setDoctor(res.data);
              localStorage.setItem("userName", res.data.name || "");

        setLoading(false);
      } catch (err) {
        setError("Failed to fetch doctor profile.");
        setLoading(false);
      }
    };

    fetchDoctorProfile();
  }, [navigate]);

  if (loading) return <div style={loadingStyle}>Loading profile...</div>;
  if (error) return <div style={errorStyle}>{error}</div>;

  return (
    <div style={profileContainer}>
      <div style={headerContainer}>
        <h2 style={headerStyle}>Doctor Profile</h2>
        <button onClick={handleLogout} style={logoutButtonStyle}>
          Logout
        </button>
      </div>

      {doctor && (
        <div style={doctorInfoContainer}>
          <div style={sectionStyle}>
            <h3 style={sectionHeader}>Personal Information</h3>
            <p><strong>Name:</strong> {doctor.name}</p>
            <p><strong>Email:</strong> {doctor.email}</p>
            <p><strong>Phone:</strong> {doctor.phone}</p>
          </div>

          <div style={sectionStyle}>
            <h3 style={sectionHeader}>Professional Information</h3>
            <p><strong>Specialization:</strong> {doctor.specialization}</p>
            <p><strong>License Number:</strong> {doctor.licenseNumber}</p>
            <p><strong>Hospital/Clinic:</strong> {doctor.hospital}</p>
          </div>
        </div>
      )}
      <div>
      {/* Your DoctorProfile JSX here */}
      <DoctorArticleForm />
    </div>
    </div>
    
  );
};

// Basic inline styles
const profileContainer = {
  maxWidth: 600,
  margin: "40px auto",
  padding: 20,
  boxShadow: "0 0 10px rgba(0,0,0,0.1)",
  borderRadius: 8,
  fontFamily: "Arial, sans-serif",
};

const headerContainer = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: 20,
};

const headerStyle = {
  margin: 0,
};

const logoutButtonStyle = {
  padding: "8px 16px",
  backgroundColor: "#dc3545",
  color: "white",
  border: "none",
  borderRadius: 4,
  cursor: "pointer",
};

const doctorInfoContainer = {
  backgroundColor: "#f9f9f9",
  padding: 20,
  borderRadius: 6,
};

const sectionStyle = {
  marginBottom: 20,
};

const sectionHeader = {
  borderBottom: "1px solid #ccc",
  paddingBottom: 8,
  marginBottom: 12,
};

const loadingStyle = {
  textAlign: "center",
  marginTop: 100,
  fontSize: 18,
};

const errorStyle = {
  color: "red",
  textAlign: "center",
  marginTop: 100,
  fontSize: 18,
};

export default DoctorProfile;
