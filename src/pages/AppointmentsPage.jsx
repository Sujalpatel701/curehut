import React, { useEffect, useState } from "react";
import axios from "axios";
import Header from "../components/Header";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

const AppointmentsPage = () => {
  const [appointments, setAppointments] = useState([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const userName = localStorage.getItem("userName");
  const userEmail = localStorage.getItem("userEmail");

  useEffect(() => {
    if (userEmail) {
      fetchAvailableAppointments();
    } else {
      setError("User email not found in local storage.");
    }
  }, [userEmail]);

  const fetchAvailableAppointments = async () => {
    try {
      const res = await axios.get(`${apiBaseUrl}/api/available`);
      setAppointments(res.data.appointments || []);
      setError("");
    } catch (err) {
      setError("Failed to load available appointments.");
      console.error(err);
    }
  };

  const handleBooking = async (id) => {
    try {
      const payload = {
        appointmentId: id,
        userName,
        userEmail,
      };

      const res = await axios.post(`${apiBaseUrl}/api/book`, payload);
      setMessage(res.data.message);
      setError("");

      // Refresh appointments after booking
      fetchAvailableAppointments();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to book appointment.");
      setMessage("");
      console.error(err);
    }
  };

  return (
    <>
      <Header />
      <div style={sectionStyle}>
        <h2>Available Appointments</h2>
        {message && <p style={{ color: "green" }}>{message}</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}

        {appointments.length === 0 ? (
          <p>No available appointments at the moment.</p>
        ) : (
          appointments.map((appt) => (
            <div key={appt._id} style={cardStyle}>
              <p><strong>Doctor Email:</strong> {appt.doctorEmail}</p>
              <p><strong>Date:</strong> {appt.date}</p>
              <p><strong>Day:</strong> {appt.day}</p>
              <p><strong>Time Slot:</strong> {appt.timeSlot}</p>
              <p><strong>Charge:</strong> ₹{appt.price}</p>
              <button style={btnStyle} onClick={() => handleBooking(appt._id)}>
                Book Appointment
              </button>
            </div>
          ))
        )}
      </div>
    </>
  );
};

// Styles
const sectionStyle = {
  marginTop: "40px",
  maxWidth: "700px",
  marginLeft: "auto",
  marginRight: "auto",
  fontFamily: "Arial, sans-serif",
};

const cardStyle = {
  padding: "16px",
  marginBottom: "15px",
  border: "1px solid #ccc",
  borderRadius: "6px",
  backgroundColor: "#fff",
  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
};

const btnStyle = {
  padding: "8px 16px",
  backgroundColor: "#007bff",
  color: "#fff",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer",
  marginTop: "10px",
};

export default AppointmentsPage;
