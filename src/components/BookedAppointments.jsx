// src/components/BookedAppointments.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

const BookedAppointments = () => {
  const [bookedAppointments, setBookedAppointments] = useState([]);
  const [error, setError] = useState("");

  const userEmail = localStorage.getItem("userEmail");

  useEffect(() => {
    if (userEmail) {
      fetchUserBookedAppointments();
    } else {
      setError("User email not found.");
    }
  }, [userEmail]);

  const fetchUserBookedAppointments = async () => {
    try {
      const res = await axios.get(`${apiBaseUrl}/api/user/app/${userEmail}`);
      setBookedAppointments(res.data.appointments || []);
    } catch (err) {
      setError("Failed to load your booked appointments.");
      console.error(err);
    }
  };

  return (
    <div>
      <h3 style={{ marginTop: "40px" }}>My Booked Appointments</h3>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {bookedAppointments.length === 0 ? (
        <p>You haven’t booked any appointments yet.</p>
      ) : (
        bookedAppointments.map((appt) => (
          <div key={appt._id} style={cardStyle}>
            <p><strong>Doctor:</strong> {appt.doctorDetails?.name || appt.doctorEmail}</p>
            <p><strong>Specialization:</strong> {appt.doctorDetails?.specialization || "N/A"}</p>
            <p><strong>Hospital:</strong> {appt.doctorDetails?.hospital || "N/A"}</p>
            <p><strong>Date:</strong> {appt.date}</p>
            <p><strong>Day:</strong> {appt.day}</p>
            <p><strong>Time Slot:</strong> {appt.timeSlot}</p>
            <p><strong>Charge:</strong> ₹{appt.price}</p>
          </div>
        ))
      )}
    </div>
  );
};

const cardStyle = {
  padding: "16px",
  marginBottom: "15px",
  border: "1px solid #ccc",
  borderRadius: "6px",
  backgroundColor: "#f0f8ff",
  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
};

export default BookedAppointments;
