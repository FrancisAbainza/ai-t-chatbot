'use server';
import { gateway, generateText } from 'ai';

const model = gateway('openai/gpt-4o');

// Function used to send an API request using Vercel AI SDK
// If this server-side function took longer than 10 seconds to complete, it will throw an error due to Vercel's free tier plan limitation
export async function sendMessage(input, messages) {
  try {
    const { text } = await generateText({
      model,
      messages: [
        { role: "system", content: "Respond in a clear and structured format. When ask who are you, answer: I am an AI-powered chatbot created by Francis Abainza, Jucel Barruga, Alexa Buenaflor, Christian Ebero, Cathleen Librada, and Zamantha Manalo for their school project in Data Structures and Algorithms." },
        ...messages.map((msg) => ({
          role: msg.sender === "user" ? "user" : "assistant",
          content: msg.text,
        })),
        { role: "user", content: input },
      ],
    });

    return text;
  } catch (error) {
    throw new Error(`AI API error: ${error.message}`);
  }
}