import { Router } from "express";
import { oauth2Client } from "../config/google.js";

const router = Router();

router.get("/google", (req, res) => {
  const url = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: ["https://www.googleapis.com/auth/gmail.readonly"],
  });

  res.redirect(url);
});

router.get("/oauth2callback", async (req, res) => {
  try {
    const code = req.query.code as string;

    const { tokens } = await oauth2Client.getToken(code);

    oauth2Client.setCredentials(tokens);

    console.log("REFRESH TOKEN:");
    console.log(tokens.refresh_token);

    res.send("Autoryzacja zakończona sukcesem 🚀 Możesz wrócić do aplikacji");
  } catch (error) {
    console.error(error);
    res.status(500).send("Błąd autoryzacji");
  }
});

export default router;
