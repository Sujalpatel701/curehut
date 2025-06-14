import React, { useState, useEffect } from "react";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./CreateAppointmentForm.css";

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
      fetchAppointments();
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
    <div className="create-appointment-container">
      <h3>Create Available Appointment Slot</h3>
      {message && <p className="success-message">{message}</p>}
      {error && <p className="error-message">{error}</p>}

      <form onSubmit={handleSubmit} className="create-appointment-form">
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

        <button type="submit">Create Appointment</button>
      </form>

      <div className="booked-appointments">
        <h3>Booked Appointments</h3>
        {appointments.length === 0 ? (
          <p>No booked appointments yet.</p>
        ) : (
          <ul>
            {appointments.map((apt) => (
              <li key={apt._id}>
                <strong>{apt.bookedBy?.name}</strong> ({apt.bookedBy?.email})<br />
                {apt.date} | {apt.day} | {apt.timeSlot}<br />
                Charge: ₹{apt.price}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default CreateAppointmentForm;
