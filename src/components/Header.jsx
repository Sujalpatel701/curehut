import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import "./Header.css";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem("token");
  const userType = localStorage.getItem("userType");

  const isProfilePage = location.pathname === "/profile" || 
                       location.pathname === "/doctor-profile";

  const handleProfileClick = () => {
    if (token) {
      navigate(userType === "user" ? "/profile" : "/doctor-profile");
    } else {
      navigate("/auth");
    }
  };

  return (
    <header className="header">
      <Link to="/" className="header-title">
        🩺 CureHut
      </Link>
      
      {!isProfilePage && (
        <nav className="nav-links">
          <Link to="/appointments">Appointments</Link>
          <Link to="/articles">Articles</Link>
          <div 
            onClick={handleProfileClick} 
            className="user-icon" 
            style={{cursor: 'pointer'}}
          >
            <FaUserCircle size={24} />
          </div>
        </nav>
      )}
      
      {isProfilePage && (
        <nav className="nav-links">
        
        </nav>
      )}
    </header>
  );
};

export default Header;