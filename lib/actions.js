'use server';
import axios from "axios";
import pRetry from "p-retry";

const API_KEY = process.env.API_KEY;

export async function sendMessage(input, messages) {
  async function run() {
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4o-mini",
        messages: [
          { 
            role: "system", 
            content: "Respond in a clear and structured format."
          },
          ...messages.map((msg) => ({
            role: msg.sender === "user" ? "user" : "assistant",
            content: msg.text,
          })),
          { role: "user", content: input }
        ],
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${API_KEY}`,
        },
      }
    );

    if (response.status < 200 || response.status >= 300) {
      throw new Error(`HTTP error ${response.status}: ${response.statusText}`);
    }

    return response.data.choices[0].message.content;
  };

  try {
    const botReply = await pRetry(run, {
      retries: 3, // Number of retries
      factor: 2, // Exponential backoff factor (2 means 1s, 2s, 4s, etc.)
      onFailedAttempt: error => {
        console.warn(`Attempt ${error.attemptNumber} failed. Retrying in ${error.delay}ms...`, error.message);
      },
      retryIf: error => error.response?.status === 504 || error.code === 'ECONNABORTED' || error.message.includes('timeout')
    });
    return botReply;
  } catch (error) {
    console.error("Failed after all retries:", error);
    throw error; // Re-throw for handling by the calling function
  }
}