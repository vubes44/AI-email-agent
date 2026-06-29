import { db } from "../config/firebase.js";

export async function getLastMessageId() {
  const doc = await db.collection("settings").doc("gmail").get();

  if (!doc.exists) {
    return null;
  }

  return doc.data()?.lastMessageId || null;
}

export async function saveLastMessageId(messageId: string) {
  await db.collection("settings").doc("gmail").set({
    lastMessageId: messageId,
  });
}
