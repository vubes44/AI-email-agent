import { Router } from "express";
import { oauth2Client, setTokens, savedTokens } from "../config/google.js";
import { google } from "googleapis";

const router = Router();

router.get("/google", (req, res) => {
  const url = oauth2Client.generateAuthUrl({
    access_type: "offline",
    prompt: "consent",
    scope: ["https://www.googleapis.com/auth/gmail.readonly"],
  });

  res.redirect(url);
});

router.get("/oauth2callback", async (req, res) => {
  try {
    const code = req.query.code as string;

    const { tokens } = await oauth2Client.getToken(code);

    setTokens(tokens);

    console.log("🔥 TOKENY ZAPISANE");

    res.send("Autoryzacja zakończona 🚀 możesz wrócić do aplikacji");
  } catch (error) {
    console.error(error);
    res.status(500).send("Błąd autoryzacji");
  }
});

router.get("/emails", async (req, res) => {
  try {
    if (!savedTokens) {
      return res.status(401).json({
        message: "Brak tokena — najpierw /auth/google",
      });
    }

    oauth2Client.setCredentials(savedTokens);

    const gmail = google.gmail({
      version: "v1",
      auth: oauth2Client,
    });

    const response = await gmail.users.messages.list({
      userId: "me",
    });

    const messages = response.data.messages || [];

    const emails = [];

    for (const message of messages) {
      const email = await gmail.users.messages.get({
        userId: "me",
        id: message.id!,
        format: "full",
      });

      const headers = email.data.payload?.headers || [];

      const subject =
        headers.find((h) => h.name === "Subject")?.value || "Brak tematu";

      const from =
        headers.find((h) => h.name === "From")?.value || "Nieznany nadawca";

      const date = headers.find((h) => h.name === "Date")?.value || "Brak daty";

      let body = "";

      if (email.data.payload?.body?.data) {
        body = Buffer.from(email.data.payload.body.data, "base64").toString(
          "utf-8",
        );
      } else if (email.data.payload?.parts) {
        const textPart = email.data.payload.parts.find(
          (part) => part.mimeType === "text/plain",
        );

        if (textPart?.body?.data) {
          body = Buffer.from(textPart.body.data, "base64").toString("utf-8");
        }
      }

      emails.push({
        id: message.id,
        subject,
        from,
        date,
        body,
      });
    }

    res.json(emails);
  } catch (error: any) {
    console.error("GMAIL ERROR:");
    console.dir(error, { depth: null });

    res.status(500).json({
      message: "Błąd pobierania maili",
      error: error?.message,
      details: error?.response?.data,
    });
  }
});

export default router;
