import { Router } from "express";
import { getConversations } from "../services/conversations.js";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const conversations = await getConversations();

    res.json(conversations);
  } catch (error: any) {
    console.error(error);

    res.status(500).json({
      message: "Błąd pobierania rozmów",
      error: error.message,
    });
  }
});

export default router;
