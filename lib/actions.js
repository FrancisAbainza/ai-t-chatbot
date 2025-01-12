'use server';
import axios from "axios";

const API_KEY = process.env.API_KEY;

export async function sendMessage(input, messages) {
  try {
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4o-mini",
        messages: [
          { 
            role: "system", 
            content: "Respond in a clear and structured format. Use bullet points for lists and avoid long paragraphs."
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

    const botReply = response.data.choices[0].message.content;
    return botReply;
  } catch (error) {
    console.error("Error fetching chatbot response:", error);
    return { sender: "bot", text: "Oops! Something went wrong." }
  }
}