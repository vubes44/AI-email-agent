import { db } from "../config/firebase.js";
import { FieldValue } from "firebase-admin/firestore";

export async function saveConversation(
  threadId: string,
  email: string,
  userMessage: string,
  aiResponse: string,
  currentProduct?: string,
) {
  await db
    .collection("conversations")
    .doc(threadId)
    .set(
      {
        threadId,
        email,
        currentProduct,

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

export async function getConversation(threadId: string) {
  const doc = await db.collection("conversations").doc(threadId).get();

  if (!doc.exists) {
    return null;
  }

  return doc.data();
}

export async function getConversations() {
  const snapshot = await db.collection("conversations").get();

  return snapshot.docs.map((doc) => doc.data());
}
