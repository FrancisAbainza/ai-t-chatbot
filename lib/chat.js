'use server';
import axios from "axios";

const API_KEY = process.env.API_KEY;

export async function sendMessage(input, messages) {
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
}