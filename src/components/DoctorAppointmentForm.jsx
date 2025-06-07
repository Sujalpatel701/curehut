import React, { useState, useEffect } from "react";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

const CreateAppointmentForm = () => {
  const [date, setDate] = useState(null);
  const [day, setDay] = useState("");
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [price, setPrice] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [appointments, setAppointments] = useState([]);

  const doctorEmail = localStorage.getItem("userEmail");

  const handleDateChange = (selectedDate) => {
    setDate(selectedDate);
    const dayName = selectedDate.toLocaleDateString("en-US", { weekday: "long" });
    setDay(dayName);
  };

  const formatTime = (time) =>
    time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: true });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!date || !startTime || !endTime || !price) {
      setError("All fields are required.");
      return;
    }

    try {
      const payload = {
        doctorEmail,
        date: date.toISOString().split("T")[0],
        day,
        timeSlot: `${formatTime(startTime)} - ${formatTime(endTime)}`,
        price: parseInt(price),
      };

      await axios.post(`${apiBaseUrl}/api/create`, payload);
      setMessage("Appointment slot created!");
      setError("");
      setDate(null);
      setDay("");
      setStartTime(null);
      setEndTime(null);
      setPrice("");
      fetchAppointments(); // Refresh the list
    } catch (err) {
      setError(err.response?.data?.message || "Error creating appointment");
      setMessage("");
    }
  };

  const fetchAppointments = async () => {
    try {
      const res = await axios.get(`${apiBaseUrl}/api/doctor/app/${doctorEmail}`);
      setAppointments(res.data.appointments || []);
    } catch (err) {
      console.error("Error fetching appointments", err);
    }
  };

  useEffect(() => {
    if (doctorEmail) {
      fetchAppointments();
    }
  }, [doctorEmail]);

  return (
    <div style={containerStyle}>
      <h3>Create Available Appointment Slot</h3>
      {message && <p style={{ color: "green" }}>{message}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <form onSubmit={handleSubmit} style={formStyle}>
        <label>
          Date:
          <DatePicker
            selected={date}
            onChange={handleDateChange}
            dateFormat="yyyy-MM-dd"
            placeholderText="Select date"
            className="input"
          />
        </label>

        <label>
          Day:
          <input type="text" value={day} disabled className="input" />
        </label>

        <label>
          Start Time:
          <DatePicker
            selected={startTime}
            onChange={(date) => setStartTime(date)}
            showTimeSelect
            showTimeSelectOnly
            timeIntervals={15}
            timeCaption="Start Time"
            dateFormat="h:mm aa"
            placeholderText="Select start time"
            className="input"
          />
        </label>

        <label>
          End Time:
          <DatePicker
            selected={endTime}
            onChange={(date) => setEndTime(date)}
            showTimeSelect
            showTimeSelectOnly
            timeIntervals={15}
            timeCaption="End Time"
            dateFormat="h:mm aa"
            placeholderText="Select end time"
            className="input"
          />
        </label>

        <label>
          Charge (₹):
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="input"
            min={0}
            placeholder="e.g. 500"
            required
          />
        </label>

        <button type="submit" style={buttonStyle}>Create Appointment</button>
      </form>

      <h3 style={{ marginTop: "40px" }}>Booked Appointments</h3>
      {appointments.length === 0 ? (
        <p>No booked appointments yet.</p>
      ) : (
        <ul style={listStyle}>
          {appointments.map((apt) => (
            <li key={apt._id} style={listItemStyle}>
              <strong>{apt.bookedBy?.name}</strong> ({apt.bookedBy?.email})<br />
              <span>{apt.date} | {apt.day} | {apt.timeSlot}</span><br />
              <span>Charge: ₹{apt.price}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

// Styles
const containerStyle = {
  marginTop: 40,
  padding: 20,
  border: "1px solid #ddd",
  borderRadius: 6,
  fontFamily: "Arial, sans-serif",
};

const formStyle = {
  display: "flex",
  flexDirection: "column",
  gap: 15,
};

const buttonStyle = {
  padding: "10px 20px",
  backgroundColor: "#28a745",
  color: "white",
  border: "none",
  borderRadius: 4,
  cursor: "pointer",
};

const listStyle = {
  listStyleType: "none",
  paddingLeft: 0,
};

const listItemStyle = {
  marginBottom: 15,
  padding: 10,
  border: "1px solid #ccc",
  borderRadius: 5,
  backgroundColor: "#f9f9f9",
};

export default CreateAppointmentForm;
