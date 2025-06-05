import React from "react";
import { HashRouter, Routes, Route } from "react-router-dom";
import AuthPage from "./pages/AuthPage";
import UserProfile from "./pages/UserProfile";
import DoctorProfile from "./pages/DoctorProfile";
import ArticleDetail from "./pages/ArticleDetail"; // <-- import this

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<AuthPage />} />
        <Route path="/profile" element={<UserProfile />} />
        <Route path="/doctor-profile" element={<DoctorProfile />} />
        <Route path="/article/:id" element={<ArticleDetail />} /> {/* new route */}
      </Routes>
    </HashRouter>
  );
}

export default App;
