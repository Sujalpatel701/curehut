import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear all auth-related data from local storage
    localStorage.removeItem("token");
    localStorage.removeItem("userEmail");
    // Redirect to login page
    navigate("/");
  };

  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = localStorage.getItem("token");
      const userEmail = localStorage.getItem("userEmail");
      
      if (!token || !userEmail) {
        setError("No user logged in.");
        setLoading(false);
        navigate("/");
        return;
      }

      try {
        // First get all users
        const allUsersRes = await axios.get(`${apiBaseUrl}/api/auth/users`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        // Find the current user by email
        const currentUser = allUsersRes.data.find(user => user.email === userEmail);
        
        if (currentUser) {
          setUser(currentUser);
        } else {
          setError("User not found");
        }
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch user profile.");
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [navigate]);

  if (loading) return <div style={loadingStyle}>Loading profile...</div>;
  if (error) return <div style={errorStyle}>{error}</div>;

  return (
    <div style={profileContainer}>
      <div style={headerContainer}>
        <h2 style={headerStyle}>User Profile</h2>
        <button onClick={handleLogout} style={logoutButtonStyle}>
          Logout
        </button>
      </div>
      
      {user && (
        <div style={userInfoContainer}>
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Phone:</strong> {user.phone}</p>
          <p><strong>Insurance Company:</strong> {user.insuranceCompany}</p>
          <p><strong>Insurance ID:</strong> {user.insuranceId}</p>
        </div>
      )}
    </div>
  );
};

// Styles
const profileContainer = {
  maxWidth: "600px",
  margin: "40px auto",
  padding: "30px",
  boxShadow: "0 0 15px rgba(0,0,0,0.1)",
  borderRadius: "8px",
};

const headerContainer = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "25px",
  borderBottom: "1px solid #eee",
  paddingBottom: "15px",
};

const headerStyle = {
  margin: "0",
  color: "#333",
};

const userInfoContainer = {
  lineHeight: "1.8",
};

const logoutButtonStyle = {
  padding: "8px 16px",
  backgroundColor: "#f44336",
  color: "white",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer",
  fontSize: "14px",
  transition: "background-color 0.3s",
};

const loadingStyle = {
  textAlign: "center",
  margin: "50px",
  fontSize: "18px",
};

const errorStyle = {
  color: "red",
  textAlign: "center",
  margin: "50px",
  fontSize: "18px",
};

export default UserProfile;