import { db } from "../config/firebase.js";
import { products } from "../data/products.js";

async function importProducts() {
  try {
    for (const product of products) {
      await db.collection("products").doc(product.id).set(product);

      console.log(`Dodano ${product.name} - ${product.variant}`);
    }

    console.log("Import zakończony.");
    process.exit(0);
  } catch (err) {
    console.error("Błąd importu:", err);
    process.exit(1);
  }
}

importProducts();
