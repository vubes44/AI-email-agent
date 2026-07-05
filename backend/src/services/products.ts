import { db } from "../config/firebase.js";

export async function getProducts() {
  const snapshot = await db.collection("products").get();

  return snapshot.docs.map((doc) => doc.data());
}

export async function decreaseProductQuantity(productName: string) {
  const snapshot = await db
    .collection("products")
    .where("name", "==", productName)
    .limit(1)
    .get();

  if (snapshot.empty) {
    return;
  }

  const doc = snapshot.docs[0];

  const data = doc.data();

  const quantity = Number(data.quantity || 0);

  const newQuantity = Math.max(0, quantity - 1);

  await doc.ref.update({
    quantity: newQuantity,
    active: newQuantity > 0,
  });
}
