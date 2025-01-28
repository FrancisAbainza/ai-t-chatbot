'use server';
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.API_KEY,
});

// Function used to send an API request to OpenAI API using openai library
// If this server-side function took longer than 10 seconds to complete, it will throw an error due to Vercel's free tier plan limitation
export async function sendMessage(input, messages) {
  // Use "openai.chat.completions.create()" method to send an API request to Open AI API with the request body as argument:
    // Request body contains the following:
      // • Model of the OpenAI API
      // • The overall conversation(the "messages" state array, to allow the AI to respond based on the topic of the overall conversation)
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o", // Replace with your desired model
      messages: [
        { role: "system", content: "Respond in a clear and structured format." }, // A message, used to change how the API answers
        ...messages.map((msg) => ({ // Message history
          role: msg.sender === "user" ? "user" : "assistant",
          content: msg.text,
        })),
        { role: "user", content: input }, // Current message of the user
      ],
    });

    // If API request was successful, return the "completion.choices[0].message.content" of the response
    return completion.choices[0].message.content;
  } catch (error) {
    throw new Error(`OpenAI API error: ${error.message}`);
  }
}