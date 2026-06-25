import { db } from "../config/firebase.js";
import { FieldValue } from "firebase-admin/firestore";

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

        messages: FieldValue.arrayUnion(
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
        ),
      },
      { merge: true },
    );
}

export async function getConversation(email: string) {
  const doc = await db.collection("conversations").doc(email).get();

  if (!doc.exists) {
    return null;
  }

  return doc.data();
}
