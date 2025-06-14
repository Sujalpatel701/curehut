import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Header from "../components/Header";
import "./ArticleDetail.css";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

const ArticleDetail = () => {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [comments, setComments] = useState([]);
  const [text, setText] = useState("");
  const [stars, setStars] = useState(5);
  const [message, setMessage] = useState("");
  const [replyText, setReplyText] = useState({});
  const [expandedReplies, setExpandedReplies] = useState({});
  const [selectedImage, setSelectedImage] = useState(null);

  const email = localStorage.getItem("userEmail") || "";
  const name = localStorage.getItem("userName") || "";

  useEffect(() => {
    fetchArticle();
    fetchComments();
  }, [id]);

  const fetchArticle = async () => {
    try {
      const res = await axios.get(`${apiBaseUrl}/api/articles`);
      const found = res.data.articles.find((a) => a._id === id);
      setArticle(found);
    } catch (err) {
      console.error("Failed to fetch article:", err);
    }
  };

  const fetchComments = async () => {
    try {
      const res = await axios.get(`${apiBaseUrl}/api/comments/${id}`);
      setComments(res.data.comments);
    } catch (err) {
      console.error("Failed to fetch comments:", err);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim() || !stars || !email || !name) {
      alert("Name or email is missing. Please log in again.");
      return;
    }

    try {
      await axios.post(`${apiBaseUrl}/api/comments`, {
        articleId: id,
        email,
        name,
        text,
        stars,
      });
      setMessage("Comment posted!");
      setText("");
      setStars(5);
      fetchComments();
    } catch (err) {
      console.error("Error posting comment:", err);
    }
  };

  const handleReplySubmit = async (e, commentId) => {
    e.preventDefault();
    if (!replyText[commentId] || !email || !name) return;

    try {
      await axios.post(`${apiBaseUrl}/api/comments/${commentId}/reply`, {
        email,
        name,
        text: replyText[commentId],
      });
      setReplyText({ ...replyText, [commentId]: "" });
      fetchComments();
    } catch (err) {
      console.error("Error posting reply:", err);
    }
  };

  const toggleReplies = (commentId) => {
    setExpandedReplies((prev) => ({
      ...prev,
      [commentId]: !prev[commentId],
    }));
  };

  if (!article) return <p>Loading...</p>;

  return (
    <>
      <Header />
      <div className="article-detail-container">
        <h2>{article.title}</h2>
        <p><strong>Doctor:</strong> {article.doctorEmail}</p>
        <p><strong>Posted:</strong> {new Date(article.createdAt).toLocaleDateString()}</p>
        <p>{article.content}</p>

        <div className="article-image-grid">
          {article.images?.map((img, i) => (
            <img
              key={i}
              src={`${apiBaseUrl}/uploads/${img}`}
              alt={`Article ${i}`}
              className="article-grid-image"
              onClick={() => setSelectedImage(`${apiBaseUrl}/uploads/${img}`)}
            />
          ))}
        </div>

        <hr />
        <h3>Leave a Comment</h3>
        {message && <p style={{ color: "green" }}>{message}</p>}
        <form onSubmit={handleCommentSubmit}>
          <textarea
            placeholder="Write your comment"
            value={text}
            onChange={(e) => setText(e.target.value)}
            required
            rows={4}
            style={{ width: "100%", padding: 10 }}
          />
          <br />
          <label>
            Rating:
            <select
              value={stars}
              onChange={(e) => setStars(parseInt(e.target.value))}
              style={{ marginLeft: 8 }}
            >
              {[1, 2, 3, 4, 5].map((s) => (
                <option key={s} value={s}>{s} Star</option>
              ))}
            </select>
          </label>
          <br />
          <button type="submit" style={{ marginTop: 10 }}>Submit</button>
        </form>

        <hr />
        <h3>Comments</h3>
        {comments.length === 0 ? (
          <p>No comments yet.</p>
        ) : (
          comments.map((c, i) => (
            <div key={i} className="comment-box">
              <p><strong>{c.name}</strong> ({c.email}) - {c.stars} ⭐</p>
              <p>{c.text}</p>
              <p className="comment-meta">{new Date(c.createdAt).toLocaleString()}</p>

              {c.replies?.length > 0 && (
                <button
                  className="toggle-replies"
                  onClick={() => toggleReplies(c._id)}
                >
                  {expandedReplies[c._id] ? "Hide Replies" : `Show Replies (${c.replies.length})`}
                </button>
              )}

              <button
                className="reply-button"
                onClick={() =>
                  setExpandedReplies((prev) => ({ ...prev, [c._id]: true }))
                }
              >
                Reply
              </button>

              {expandedReplies[c._id] && (
                <div className="reply-dropdown">
                  {c.replies?.length > 0 &&
                    c.replies.map((r, j) => (
                      <div key={j} className="reply-box">
                        <p><strong>{r.name}</strong> ({r.email})</p>
                        <p>{r.text}</p>
                        <p className="comment-meta">{new Date(r.createdAt).toLocaleString()}</p>
                      </div>
                    ))}

                  <form
                    onSubmit={(e) => handleReplySubmit(e, c._id)}
                    className="reply-form"
                  >
                    <textarea
                      placeholder="Write your reply"
                      value={replyText[c._id] || ""}
                      onChange={(e) =>
                        setReplyText({ ...replyText, [c._id]: e.target.value })
                      }
                      required
                      rows={2}
                    />
                    <button type="submit">Reply</button>
                  </form>
                </div>
              )}
            </div>
          ))
        )}

        {selectedImage && (
          <div className="image-modal" onClick={() => setSelectedImage(null)}>
            <div className="image-modal-content" onClick={(e) => e.stopPropagation()}>
              <img src={selectedImage} alt="Enlarged" />
              <button className="close-modal" onClick={() => setSelectedImage(null)}>X</button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ArticleDetail;
