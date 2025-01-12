'use client';
import { useState } from 'react';
import ReactMarkdown from 'react-markdown';

import styles from './Chatbot.module.css';
import { sendMessageAction } from '@/lib/actions.js';

export default function Chatbot() {
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hi! How can I help you today?" },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSend() {
    if (!input.trim()) return;

    let botReply;
    const newMessage = { sender: "user", text: input };
    setMessages((prev) => [...prev, newMessage]);
    setInput("");
    setIsLoading(true);

    try {
      botReply = await sendMessageAction(input, messages);
    } catch (error) {
      botReply = "Oops! Something went wrong. Please try again."
    }

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