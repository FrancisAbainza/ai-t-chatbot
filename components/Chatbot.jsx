'use client';
import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import pRetry from "p-retry";
import { motion } from 'framer-motion';

import styles from './Chatbot.module.css';
import LoadingIndicator from './ui/LoadingIndicator.jsx';
import { sendMessage } from '@/lib/chat';

export default function Chatbot() {
  const [messages, setMessages] = useState([ // "messages" state array used to store the overall conversation
    { sender: "bot", text: "Hi! How can I help you today?" },
  ]);
  const [input, setInput] = useState(""); // "input" state used to store the user input in the input field
  const [isLoading, setIsLoading] = useState(false); // "isLoading" state used to conditionally display a loading indicator

  // If the user clicks the "Send" button, do:
  async function handleSend() {
    // If the input field is empty, do nothing
    if (!input.trim()) return;

    // Construct the new message to be sent to OpenAI API request
    let botReply;
    const newMessage = { sender: "user", text: input };
    setMessages((prev) => [...prev, newMessage]); // Add the new message to the "messages" state array
    setInput(""); // Clear the input field
    setIsLoading(true); // Set the loading to true to add loading indicator

    // Send an API request to OpenAI API using the sendMessage server-side function 
    try {
      // If the server-side function was successful, store the API response to the "botReply" variable
      // If the server-side function throws an error with a status code of 504, an error code of 'ECONNABORTED', or if the error massage has the keyword 'timeout' do: 
      // • Rerun the server side function again using the p-retry library. Maximum of 3 retries.
      botReply = await pRetry(
        () => sendMessage(input, messages),
        {
          retries: 3,
          factor: 2,
          onFailedAttempt: error => {
            console.warn(`Attempt ${error.attemptNumber} failed. Retrying in ${error.delay}ms...`, error.message);
          },
          retryIf: error => error.response?.status === 504 || error.code === 'ECONNABORTED' || error.message.includes('timeout')
        }
      );
    } catch (error) {
      // If the server-side function fails after the third retry, set the "botReply" as the following:
      botReply = "Oops! Something went wrong. Please try again."
    }

    setMessages((prev) => [...prev, { sender: "bot", text: botReply }]); // Add the "botReply" to the "messages" state array
    setIsLoading(false); // Set the loading to false to remove loading indicator
  }

  // If the user clicks "enter" while focusing on the input field, do:
  function handleKeyDown(event) {
    if (event.key === "Enter") {
      handleSend();
    }
  };

  return (
    <section className={styles.chatbot}>
      <div className={styles.chatWindow}>
        {/* Display the "messages" state array */}
        {messages.map((msg, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className={styles.message}
            style={{
              alignSelf: msg.sender === "user" ? "flex-end" : "flex-start",
              backgroundColor: msg.sender === "user" ? "white" : "#1D1D1D",
              color: msg.sender === "user" ? "black" : "white",
            }}
          >
            <ReactMarkdown>{msg.text}</ReactMarkdown>
          </motion.div>
        ))}
        {/* Display the loading indicator if there is an ongoing API request */}
        {isLoading && <LoadingIndicator />}
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