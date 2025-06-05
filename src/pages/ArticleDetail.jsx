import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

const ArticleDetail = () => {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [comments, setComments] = useState([]);
  const [text, setText] = useState("");
  const [stars, setStars] = useState(5);
  const [message, setMessage] = useState("");
  const [replyText, setReplyText] = useState({});
  const [replyingTo, setReplyingTo] = useState(null);

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
      setReplyingTo(null);
      fetchComments();
    } catch (err) {
      console.error("Error posting reply:", err);
    }
  };

  if (!article) return <p>Loading...</p>;

  return (
    <div style={{ maxWidth: 700, margin: "auto", padding: 20 }}>
      <h2>{article.title}</h2>
      <p><strong>Doctor:</strong> {article.doctorEmail}</p>
      <p><strong>Posted:</strong> {new Date(article.createdAt).toLocaleDateString()}</p>
      <p>{article.content}</p>

      {article.images?.map((img, i) => (
        <img
          key={i}
          src={`${apiBaseUrl}/uploads/${img}`}
          alt=""
          style={{ maxWidth: "100%", marginTop: 10 }}
        />
      ))}

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
          <div key={i} style={{ border: "1px solid #ddd", padding: 10, marginTop: 10 }}>
            <p><strong>{c.name}</strong> ({c.email}) - {c.stars} ⭐</p>
            <p>{c.text}</p>
            <p style={{ fontSize: 12, color: "#888" }}>
              {new Date(c.createdAt).toLocaleString()}
            </p>

            {/* Replies */}
            {c.replies?.length > 0 && (
              <div style={{ marginTop: 10, paddingLeft: 20 }}>
                <strong>Replies:</strong>
                {c.replies.map((r, j) => (
                  <div
                    key={j}
                    style={{
                      marginTop: 5,
                      borderLeft: "2px solid #ccc",
                      paddingLeft: 10,
                    }}
                  >
                    <p><strong>{r.name}</strong> ({r.email})</p>
                    <p>{r.text}</p>
                    <p style={{ fontSize: 12, color: "#666" }}>
                      {new Date(r.createdAt).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* Reply Form */}
            {replyingTo === c._id ? (
              <form onSubmit={(e) => handleReplySubmit(e, c._id)} style={{ marginTop: 10 }}>
                <textarea
                  placeholder="Write your reply"
                  value={replyText[c._id] || ""}
                  onChange={(e) =>
                    setReplyText({ ...replyText, [c._id]: e.target.value })
                  }
                  required
                  rows={2}
                  style={{ width: "100%", padding: 8 }}
                />
                <button type="submit" style={{ marginTop: 5 }}>Reply</button>
                <button
                  type="button"
                  onClick={() => setReplyingTo(null)}
                  style={{ marginLeft: 10 }}
                >
                  Cancel
                </button>
              </form>
            ) : (
              <button onClick={() => setReplyingTo(c._id)} style={{ marginTop: 10 }}>
                Reply
              </button>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default ArticleDetail;
