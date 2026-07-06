import { db } from "../config/firebase.js";

export async function getProducts() {
  const snapshot = await db.collection("products").get();

  return snapshot.docs.map((doc) => doc.data());
}

export async function decreaseProductQuantity(productName: string) {
  console.log("====================================");
  console.log("🔍 decreaseProductQuantity()");
  console.log("Szukam produktu:", productName);

  const snapshot = await db
    .collection("products")
    .where("name", "==", productName)
    .limit(1)
    .get();

  console.log("Znaleziono dokumentów:", snapshot.size);

  if (snapshot.empty) {
    console.log("❌ Nie znaleziono produktu w bazie.");
    console.log("====================================");
    return;
  }

  const doc = snapshot.docs[0];
  const data = doc.data();

  console.log("📦 Dane produktu:", data);

  const quantity = Number(data.quantity || 0);

  console.log("Aktualna ilość:", quantity);

  const newQuantity = Math.max(0, quantity - 1);

  console.log("Nowa ilość:", newQuantity);

  await doc.ref.update({
    quantity: newQuantity,
    active: newQuantity > 0,
  });

  console.log("✅ Produkt został zaktualizowany.");
  console.log("====================================");
}
