import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Header from "../components/Header";
import "./ArticlesPage.css";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

const ArticlesPage = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const res = await axios.get(`${apiBaseUrl}/api/articles`);
        setArticles(res.data.articles || []);
      } catch (err) {
        console.error(err);
        setError("Failed to load articles.");
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  if (loading) return <div className="loading-message">Loading articles...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <>
      <Header />
      <div className="articles-page-container">
        <h2>Doctor Articles</h2>
        {articles.length === 0 ? (
          <p className="no-articles">No articles available.</p>
        ) : (
          <div className="articles-grid">
            {articles.map((article) => (
              <Link
                to={`/article/${article._id}`}
                key={article._id}
                className="article-card"
              >
                <h4 className="article-title">{article.title}</h4>
                <p className="article-content">{article.content.slice(0, 100)}...</p>
                <p className="article-meta">
                  Doctor: <span>{article.doctorEmail}</span><br />
                  Posted on: <span>{new Date(article.createdAt).toLocaleDateString()}</span>
                </p>
                {article.images?.length > 0 && (
                  <div className="image-gallery">
                    {article.images.map((img, i) => (
                      <img
                        key={i}
                        src={`${apiBaseUrl}/uploads/${img}`}
                        alt="article"
                        className="article-image"
                      />
                    ))}
                  </div>
                )}
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default ArticlesPage;
