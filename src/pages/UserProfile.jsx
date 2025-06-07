import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import AvailableAppointments from "../components/AvailableAppointments";

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

  if (loading) return <div style={loadingStyle}>Loading...</div>;
  if (error) return <div style={errorStyle}>{error}</div>;

  return (
    <div style={profileContainer}>
      <div style={headerContainer}>
        <h2 style={headerStyle}>User Profile</h2>
        <button onClick={handleLogout} style={logoutButtonStyle}>Logout</button>
      </div>

      {user && (
        <div style={userInfoContainer}>
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Phone:</strong> {user.phone}</p>
          <p><strong>Insurance Company:</strong> {user.insuranceCompany}</p>
          <p><strong>Insurance ID:</strong> {user.insuranceId}</p>
        </div>
      )}

      <div style={{ marginTop: "40px" }}>
        <h3>Articles from Doctors</h3>
        {articles.length === 0 ? (
          <p style={{ fontStyle: "italic" }}>No articles available.</p>
        ) : (
          articles.map((article, index) => (
            <Link
              to={`/article/${article._id}`}
              key={index}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <div style={articleCardStyle}>
                <h4>{article.title}</h4>
                <p>{article.content.slice(0, 150)}...</p>
                <small>Doctor: {article.doctorEmail}</small><br />
                <small>Posted on: {new Date(article.createdAt).toLocaleDateString()}</small>

                {article.images?.length > 0 && (
                  <div style={imageGalleryStyle}>
                    {article.images.map((img, i) => (
                      <img
                        key={i}
                        src={`${apiBaseUrl}/uploads/${img}`}
                        alt="article"
                        style={imageStyle}
                      />
                    ))}
                  </div>
                )}
              </div>
            </Link>
          ))
        )}
      </div>
      <div>
        <AvailableAppointments />
</div>
    </div>
  );
};

// Styles
const profileContainer = {
  maxWidth: "800px",
  margin: "40px auto",
  padding: "30px",
  boxShadow: "0 0 15px rgba(0,0,0,0.1)",
  borderRadius: "8px",
};

const headerContainer = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "25px",
  borderBottom: "1px solid #eee",
  paddingBottom: "15px",
};

const headerStyle = {
  margin: "0",
  color: "#333",
};

const userInfoContainer = {
  lineHeight: "1.8",
};

const logoutButtonStyle = {
  padding: "8px 16px",
  backgroundColor: "#f44336",
  color: "white",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer",
  fontSize: "14px",
};

const loadingStyle = {
  textAlign: "center",
  margin: "50px",
  fontSize: "18px",
};

const errorStyle = {
  color: "red",
  textAlign: "center",
  margin: "50px",
  fontSize: "18px",
};

const articleCardStyle = {
  border: "1px solid #ddd",
  borderRadius: "6px",
  padding: "16px",
  marginBottom: "20px",
  backgroundColor: "#f9f9f9",
  cursor: "pointer",
};

const imageGalleryStyle = {
  display: "flex",
  flexWrap: "wrap",
  marginTop: "10px",
  gap: "10px",
};

const imageStyle = {
  width: "100px",
  height: "100px",
  objectFit: "cover",
  borderRadius: "4px",
  border: "1px solid #ccc",
};

export default UserProfile;
