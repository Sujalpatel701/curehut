// src/pages/UserProfile.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import BookedAppointments from "../components/BookedAppointments";
import "./UserProfile.css";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userName");
    navigate("/");
  };

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      const userEmail = localStorage.getItem("userEmail");

      if (!token || !userEmail) {
        setError("No user logged in.");
        setLoading(false);
        navigate("/");
        return;
      }

      try {
        const usersRes = await axios.get(`${apiBaseUrl}/api/auth/users`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const currentUser = usersRes.data.find((u) => u.email === userEmail);
        if (!currentUser) {
          setError("User not found");
          setLoading(false);
          return;
        }

        localStorage.setItem("userName", currentUser.name || "");
        setUser(currentUser);
      } catch (err) {
        console.error(err);
        setError("Failed to load user data.");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [navigate]);

  if (loading) return <div className="loading-message">Loading...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <>
      <Header />
      <div className="profile-container">
        <div className="profile-header-container">
          <h2 className="profile-header">User Profile</h2>
          <button onClick={handleLogout} className="logout-button">
            Logout
          </button>
        </div>

        {user && (
          <div className="user-info-container">
            <p><strong>Name:</strong> {user.name}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Phone:</strong> {user.phone}</p>
            <p><strong>Insurance Company:</strong> {user.insuranceCompany}</p>
            <p><strong>Insurance ID:</strong> {user.insuranceId}</p>
          </div>
        )}

        <div className="appointments-section">
          <BookedAppointments />
        </div>
      </div>
    </>
  );
};

export default UserProfile;
