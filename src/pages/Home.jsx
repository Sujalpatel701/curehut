import React from "react";
import ChatBox from "../components/ChatBox";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "./Home.css";

function Home() {
  return (
    <>
      <Header />
      <div className="home-container">
        <h1>Welcome to CureHut 🏥</h1>
        <p>
          Your one-stop health companion for booking appointments, reading medical articles, and staying informed.
        </p>

        {/* Removed navigation buttons */}

        <ChatBox />
      </div>
      <Footer />
    </>
  );
}

export default Home;
