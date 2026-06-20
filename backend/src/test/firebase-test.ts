import { db } from "../config/firebase.js";

async function test() {
  try {
    const doc = await db.collection("test").add({
      message: "Firebase działa",
      createdAt: new Date(),
    });

    console.log("OK");
    console.log("Document ID:", doc.id);
  } catch (error) {
    console.error(error);
  }
}

test();
