import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import DoctorArticleForm from "../components/DoctorArticleForm";
import DoctorAppointmentForm from "../components/DoctorAppointmentForm";
import Header from "../components/Header";
import "./DoctorProfile.css";

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
      setError("Failed to fetch doctor data.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctorProfile();
  }, []);

  if (loading) return <div className="loading">Loading profile...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <>
      <Header />
      <div className="doctor-profile-wrapper">
        <div className="left-column">
          <div className="profile-header">
            <h2>Doctor Profile</h2>
            <button onClick={handleLogout} className="logout-button">Logout</button>
          </div>

          {doctor && (
            <div className="doctor-info">
              <div className="section">
                <h3>Personal Information</h3>
                <p><strong>Name:</strong> {doctor.name}</p>
                <p><strong>Email:</strong> {doctor.email}</p>
                <p><strong>Phone:</strong> {doctor.phone}</p>
              </div>
              <div className="section">
                <h3>Professional Information</h3>
                <p><strong>Specialization:</strong> {doctor.specialization}</p>
                <p><strong>License Number:</strong> {doctor.licenseNumber}</p>
                <p><strong>Hospital/Clinic:</strong> {doctor.hospital}</p>
              </div>
            </div>
          )}

          <DoctorArticleForm />
        </div>

        <div className="right-column">
          <DoctorAppointmentForm />
        </div>
      </div>
    </>
  );
};

export default DoctorProfile;
