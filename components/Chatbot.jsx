'use client';
import { useState } from 'react';
import ReactMarkdown from 'react-markdown';

import styles from './Chatbot.module.css';
import { sendMessage } from '@/lib/actions';


const formatResponse = (responseText) => {
  // Replace `###` with <h3> (for headers)
  responseText = responseText.replace(/^### (.+)$/gm, '<h3>$1</h3>');

  // Replace `**text**` with <strong>text</strong> for bold
  responseText = responseText.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');

  // Replace `*text*` with <em>text</em> for italics
  responseText = responseText.replace(/\*(.+?)\*/g, '<em>$1</em>');

  // Replace inline code `text` with <code>text</code>
  responseText = responseText.replace(/`([^`]+)`/g, '<code>$1</code>');

  // Replace code blocks (triple backticks) with <pre><code>...</code></pre>
  responseText = responseText.replace(/```([\s\S]+?)```/g, '<pre><code>$1</code></pre>');

  // Replace line breaks (\n) with <br> for line breaks
  responseText = responseText.replace(/\n/g, '<br>');

  return responseText;
};

export default function Chatbot() {
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hi! How can I help you today?" },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSend() {
    if (!input.trim()) return;

    const newMessage = { sender: "user", text: input };
    setMessages((prev) => [...prev, newMessage]);
    setInput("");
    setIsLoading(true);

    const botReply = await sendMessage(input, messages);
    setMessages((prev) => [...prev, { sender: "bot", text: botReply }]);
    setIsLoading(false);
  }

  function handleKeyDown(event) {
    if (event.key === "Enter") {
      handleSend();
    }
  };

  return (
    <section className={styles.chatbot}>
      <div className={styles.chatWindow}>
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={styles.message}
            style={{
              alignSelf: msg.sender === "user" ? "flex-end" : "flex-start",
              backgroundColor: msg.sender === "user" ? "white" : "#1D1D1D",
              color: msg.sender === "user" ? "black" : "white",
            }}
          >
            <ReactMarkdown>{msg.text}</ReactMarkdown>
          </div>
        ))}
        {isLoading && <p className={styles.loadingIndicator}>Typing...</p>}
      </div>
      <div className={styles.inputContainer}>
        <input
          type="text"
          value={input}
          disabled={isLoading}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your message..."
          className={styles.input}
        />
        <button disabled={isLoading} onClick={handleSend} className={styles.button}>
          Send
        </button>
      </div>
    </section>
  );
}