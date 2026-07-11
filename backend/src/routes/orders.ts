import { Router } from "express";
import { getOrders } from "../services/orders.js";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const orders = await getOrders();

    res.json(orders);
  } catch (error: any) {
    console.error(error);

    res.status(500).json({
      message: "Błąd pobierania zamówień",
      error: error.message,
    });
  }
});

export default router;
