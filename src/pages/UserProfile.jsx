import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import AvailableAppointments from "../components/AvailableAppointments";
import Header from "../components/Header";
import "./UserProfile.css"; // Import the CSS file

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userName");
    navigate("/");
  };

  useEffect(() => {
    const fetchUserAndArticles = async () => {
      const token = localStorage.getItem("token");
      const userEmail = localStorage.getItem("userEmail");

      if (!token || !userEmail) {
        setError("No user logged in.");
        setLoading(false);
        navigate("/");
        return;
      }

      try {
        const usersRes = await axios.get(`${apiBaseUrl}/api/auth/users`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const currentUser = usersRes.data.find((u) => u.email === userEmail);
        if (!currentUser) {
          setError("User not found");
          setLoading(false);
          return;
        }

        localStorage.setItem("userName", currentUser.name || "");
        setUser(currentUser);

        const articlesRes = await axios.get(`${apiBaseUrl}/api/articles`);
        setArticles(articlesRes.data.articles || []);
      } catch (err) {
        console.error(err);
        setError("Failed to load data.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserAndArticles();
  }, [navigate]);

  if (loading) return <div className="loading-message">Loading...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <>
      <Header />
      <div className="profile-container">
        <div className="profile-header-container">
          <h2 className="profile-header">User Profile</h2>
          <button onClick={handleLogout} className="logout-button">
            Logout
          </button>
        </div>

        {user && (
          <div className="user-info-container">
            <p><strong>Name:</strong> {user.name}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Phone:</strong> {user.phone}</p>
            <p><strong>Insurance Company:</strong> {user.insuranceCompany}</p>
            <p><strong>Insurance ID:</strong> {user.insuranceId}</p>
          </div>
        )}

        <div className="articles-section">
          <h3>Articles from Doctors</h3>
          {articles.length === 0 ? (
            <p className="no-articles">No articles available.</p>
          ) : (
            articles.map((article, index) => (
              <Link
                to={`/article/${article._id}`}
                key={index}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <div className="article-card">
                  <h4>{article.title}</h4>
                  <p>{article.content.slice(0, 150)}...</p>
                  <small>Doctor: {article.doctorEmail}</small>
                  <small>Posted on: {new Date(article.createdAt).toLocaleDateString()}</small>

                  {article.images?.length > 0 && (
                    <div className="image-gallery">
                      {article.images.map((img, i) => (
                        <img
                          key={i}
                          src={`${apiBaseUrl}/uploads/${img}`}
                          alt="article"
                        />
                      ))}
                    </div>
                  )}
                </div>
              </Link>
            ))
          )}
        </div>
        <div className="appointments-section">
          <AvailableAppointments />
        </div>
      </div>
    </>
  );
};

export default UserProfile;