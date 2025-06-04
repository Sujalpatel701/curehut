import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AuthPage from "./pages/AuthPage";          // This should render your LoginForm component
import UserProfile from "./pages/UserProfile";
import DoctorProfile from "./pages/DoctorProfile";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AuthPage />} />
        <Route path="/profile" element={<UserProfile />} />
        <Route path="/doctor-profile" element={<DoctorProfile />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
