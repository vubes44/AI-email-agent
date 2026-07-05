import { db } from "../config/firebase.js";

export async function createOrder(order: any) {
  const docRef = db.collection("orders").doc();

  await docRef.set({
    id: docRef.id,

    customer_name: order.customer_name,
    customer_email: order.customer_email,

    threadId: order.threadId,

    product_name: order.product_name,
    variant: order.variant,

    quantity: order.quantity,
    price: order.price,

    status: "new",

    created_at: new Date(),
  });

  return docRef.id;
}
