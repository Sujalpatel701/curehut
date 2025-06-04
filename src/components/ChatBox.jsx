import React, { useState } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";

const ChatBox = () => {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;  // use env variable

  const isHealthRelated = (input) => {
    const keywords = [
      "health", "disease", "remedy", "remedies", "symptom", "cure", "medicine",
      "treatment", "infection", "fever", "cold", "pain", "injury", "hospital",
      "headache", "nutrition", "fitness", "exercise"
    ];
    return keywords.some((word) => input.toLowerCase().includes(word));
  };

  const handleAsk = async () => {
    if (!question.trim()) return;

    if (!isHealthRelated(question)) {
      setAnswer("❌ Please ask a question related to **health**, diseases, cures, or remedies.");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(`${API_BASE_URL}/api/ask`, { question });
      setAnswer(res.data.answer);
    } catch (error) {
      setAnswer("❌ Error: Could not fetch answer.");
    }
    setLoading(false);
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>CureHut AI – Ask a Health Question</h1>
      <textarea
        rows={4}
        style={styles.textarea}
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder="Ask something about health, diseases, remedies..."
      />
      <button onClick={handleAsk} style={styles.button}>
        {loading ? "Thinking..." : "Ask Gemini"}
      </button>
      <div style={styles.answer}>
        <strong>Answer:</strong>
        <div style={{ marginTop: 10 }}>
          <ReactMarkdown>{answer}</ReactMarkdown>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: "700px",
    margin: "40px auto",
    padding: "20px",
    textAlign: "center",
    background: "#f8f8f8",
    borderRadius: "10px",
    boxShadow: "0 0 10px rgba(0,0,0,0.1)",
  },
  heading: {
    marginBottom: "20px",
  },
  textarea: {
    width: "100%",
    padding: "10px",
    fontSize: "16px",
    resize: "vertical",
  },
  button: {
    marginTop: "10px",
    padding: "10px 20px",
    fontSize: "16px",
    cursor: "pointer",
  },
  answer: {
    marginTop: "20px",
    textAlign: "left",
  },
};

export default ChatBox;
