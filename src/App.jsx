import React from "react";
import { HashRouter, Routes, Route } from "react-router-dom";
import AuthPage from "./pages/AuthPage";
import UserProfile from "./pages/UserProfile";
import DoctorProfile from "./pages/DoctorProfile";
import ArticleDetail from "./pages/ArticleDetail";
import ArticlesPage from "./pages/ArticlesPage";
import AppointmentsPage from "./pages/AppointmentsPage";
import Home from "./pages/Home";

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/profile" element={<UserProfile />} />
        <Route path="/doctor-profile" element={<DoctorProfile />} />
        <Route path="/article/:id" element={<ArticleDetail />} />
        <Route path="/articles" element={<ArticlesPage />} />
        <Route path="/appointments" element={<AppointmentsPage />} />
      </Routes>
    </HashRouter>
  );
}

export default App;
