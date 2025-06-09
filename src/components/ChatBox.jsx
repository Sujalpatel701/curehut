import React, { useState } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import "./ChatBox.css";

const ChatBox = () => {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

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
    <div className="chatbox-container">
      <h2 className="chatbox-heading">CureCare AI – Ask a Health Question</h2>
      <textarea
        className="chatbox-textarea"
        rows={4}
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder="Ask something about health, diseases, remedies..."
      />
      <button onClick={handleAsk} className="chatbox-button">
        {loading ? "Thinking..." : "Ask Gemini"}
      </button>
      <div className="chatbox-answer">
        <strong>Answer:</strong>
        <ReactMarkdown>{answer}</ReactMarkdown>
      </div>
    </div>
  );
};

export default ChatBox;
