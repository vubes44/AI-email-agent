import { db } from "../config/firebase.js";

export async function getDashboardStats() {
  const productsSnapshot = await db.collection("products").get();
  const ordersSnapshot = await db.collection("orders").get();
  const conversationsSnapshot = await db.collection("conversations").get();

  const customers = new Set<string>();

  ordersSnapshot.docs.forEach((doc) => {
    const data = doc.data();

    if (data.customer_email) {
      customers.add(data.customer_email);
    }
  });

  return {
    orders: ordersSnapshot.size,
    products: productsSnapshot.size,
    customers: customers.size,
    conversations: conversationsSnapshot.size,
  };
}
