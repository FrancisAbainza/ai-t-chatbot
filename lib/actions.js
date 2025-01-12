import pRetry from "p-retry";

import { sendMessage } from "./chat.js";

export async function sendMessageAction(input, messages) {
  try {
    const botReply = await pRetry(() => sendMessage(input, messages), {
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
    throw error;
  }
}