import React from "react";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <p>&copy; {new Date().getFullYear()} CureHut — Built with ❤️</p>
      <p>
        <a href="https://github.com/your-github" target="_blank" rel="noreferrer">GitHub</a> | 
        <a href="https://linkedin.com/in/your-linkedin" target="_blank" rel="noreferrer"> LinkedIn</a> | 
        <a href="https://instagram.com/your-insta" target="_blank" rel="noreferrer"> Instagram</a>
      </p>
    </footer>
  );
};

export default Footer;
