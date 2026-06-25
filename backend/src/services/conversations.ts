import { db } from "../config/firebase.js";

export async function saveConversation(
  email: string,
  userMessage: string,
  aiResponse: string,
) {
  await db
    .collection("conversations")
    .doc(email)
    .set(
      {
        email,

        messages: [
          {
            role: "user",
            content: userMessage,
            createdAt: new Date(),
          },
          {
            role: "assistant",
            content: aiResponse,
            createdAt: new Date(),
          },
        ],
      },
      { merge: true },
    );
}
