import { Router } from "express";
import { getDashboardStats } from "../services/dashboard.js";

const router = Router();

router.get("/stats", async (req, res) => {
  try {
    const stats = await getDashboardStats();

    res.json(stats);
  } catch (error: any) {
    console.error(error);

    res.status(500).json({
      message: "Błąd pobierania statystyk",
      error: error.message,
    });
  }
});

export default router;
