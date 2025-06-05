import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const DoctorArticleForm = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [images, setImages] = useState([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [articles, setArticles] = useState([]);

  const doctorEmail = localStorage.getItem("userEmail");

  const handleImageChange = (e) => {
    setImages([...e.target.files]);
  };

  const fetchArticles = async () => {
    try {
      const res = await axios.get(`${apiBaseUrl}/api/articles/doctor/${doctorEmail}`);
      setArticles(res.data.articles);
    } catch (err) {
      console.error("Error fetching articles:", err);
    }
  };

  useEffect(() => {
    if (doctorEmail) {
      fetchArticles();
    }
  }, [doctorEmail]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !content) {
      setError("Title and Content are required.");
      return;
    }

    if (!doctorEmail) {
      setError("Doctor not logged in.");
      return;
    }

    try {
      setError("");
      setMessage("Uploading...");

      const formData = new FormData();
      formData.append("title", title);
      formData.append("content", content);
      formData.append("doctorEmail", doctorEmail);
      images.forEach((image) => formData.append("images", image));

      await axios.post(`${apiBaseUrl}/api/articles`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setMessage("Article created successfully!");
      setTitle("");
      setContent("");
      setImages([]);
      fetchArticles();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create article.");
      setMessage("");
    }
  };

  return (
    <div style={containerStyle}>
      <h2>Write New Article</h2>
      {message && <p style={{ color: "green" }}>{message}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <form onSubmit={handleSubmit} style={formStyle}>
        <label style={labelStyle}>
          Title:
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={inputStyle}
            maxLength={200}
            required
          />
        </label>

        <label style={labelStyle}>
          Content:
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            style={textareaStyle}
            rows={8}
            required
          />
        </label>

        <label style={labelStyle}>
          Upload Images (max 5):
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageChange}
            style={inputStyle}
          />
        </label>

        <button type="submit" style={buttonStyle}>
          Submit Article
        </button>
      </form>

      <h3 style={{ marginTop: 40 }}>Your Articles</h3>
      {articles.length === 0 ? (
        <p>No articles posted yet.</p>
      ) : (
        articles.map((article) => (
          <div key={article._id} style={articleCardStyle}>
            <Link
              to={`/article/${article._id}`}
              style={{ textDecoration: "none", color: "black" }}
            >
              <h4>{article.title}</h4>
              <p>{article.content.slice(0, 100)}...</p>
            </Link>

            {article.images?.length > 0 && (
              <div style={imageGridStyle}>
                {article.images.map((img, idx) => (
                  <img
                    key={idx}
                    src={`${apiBaseUrl}/uploads/${img}`}
                    alt={`Article ${idx}`}
                    style={imageStyle}
                  />
                ))}
              </div>
            )}

            <small>Posted on: {new Date(article.createdAt).toLocaleString()}</small>
          </div>
        ))
      )}
    </div>
  );
};

// Styles
const containerStyle = {
  maxWidth: 600,
  margin: "40px auto",
  padding: 20,
  boxShadow: "0 0 10px rgba(0,0,0,0.1)",
  borderRadius: 8,
  fontFamily: "Arial, sans-serif",
};

const formStyle = {
  display: "flex",
  flexDirection: "column",
};

const labelStyle = {
  marginBottom: 15,
  fontWeight: "bold",
};

const inputStyle = {
  marginTop: 6,
  padding: 8,
  fontSize: 16,
  width: "100%",
  boxSizing: "border-box",
};

const textareaStyle = {
  ...inputStyle,
  resize: "vertical",
};

const buttonStyle = {
  padding: "10px 20px",
  backgroundColor: "#007bff",
  color: "white",
  border: "none",
  borderRadius: 4,
  cursor: "pointer",
  fontSize: 16,
};

const articleCardStyle = {
  marginTop: 20,
  padding: 15,
  border: "1px solid #ccc",
  borderRadius: 6,
};

const imageGridStyle = {
  display: "flex",
  flexWrap: "wrap",
  gap: 10,
  marginTop: 10,
};

const imageStyle = {
  width: 100,
  height: 100,
  objectFit: "cover",
  borderRadius: 4,
  border: "1px solid #ddd",
};

export default DoctorArticleForm;
