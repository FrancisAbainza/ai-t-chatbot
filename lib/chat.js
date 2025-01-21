'use server';
import axios from "axios";

const API_KEY = process.env.API_KEY;

// Function used to send an API request to OpenAI API
// If this server-side function took longer than 10 seconds to complete, it will throw an error due to Vercel's free tier plan limitation
export async function sendMessage(input, messages) {
  // Use axios to send a post request to OpenAI API
  // Fist argument is the link of the API
  // Second argument is the request body, it contains:
    // • The system message(how you want the ai to respond)
    // • The overall conversation(the "messages" state array, to allow the AI to respond based on the topic of the overall conversation)
  // Third argument is the request configuration, containing our API key
  const response = await axios.post(
    "https://api.openai.com/v1/chat/completions",
    {
      model: "gpt-4o",
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

  // The API request will return a status code of 200 - 299 if successful
  // If it returned other status code, throw an error so that we can catch it in the chatbot and display necessary message.
  if (response.status < 200 || response.status >= 300) {
    throw new Error(`HTTP error ${response.status}: ${response.statusText}`);
  }

  // If API request was successful, return the API response content
  return response.data.choices[0].message.content;
}