import { db } from "../config/firebase.js";

export async function getProducts() {
  const snapshot = await db.collection("products").get();

  return snapshot.docs.map((doc) => doc.data());
}
