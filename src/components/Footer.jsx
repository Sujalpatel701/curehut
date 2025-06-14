import React from "react";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <p>&copy; {new Date().getFullYear()} FrameFlux — Built with ❤️ by Sujal Patel</p>
      <p>
        <a href="https://github.com/Sujalpatel701" target="_blank" rel="noreferrer">GitHub</a> | 
        <a href="https://www.linkedin.com/in/sujal-patel-b2b602248/" target="_blank" rel="noreferrer"> LinkedIn</a> | 
        <a href="https://www.instagram.com/sujal_patel_701/" target="_blank" rel="noreferrer"> Instagram</a>
      </p>
    </footer>
  );
};

export default Footer;
