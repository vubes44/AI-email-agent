import { Router } from "express";
import { db } from "../config/firebase.js";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const snapshot = await db.collection("products").get();

    const products = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.json(products);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Błąd pobierania produktów",
    });
  }
});

export default router;
