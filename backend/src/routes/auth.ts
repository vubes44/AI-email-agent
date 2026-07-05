import { Router } from "express";
import { oauth2Client, setTokens, savedTokens } from "../config/google.js";
import { google } from "googleapis";
import { analyzeEmail } from "../services/gemini.js";
import { saveConversation } from "../services/conversations.js";
import { sendEmail } from "../services/gmail.js";
import { getLastMessageId, saveLastMessageId } from "../services/settings.js";
import { createOrder } from "../services/orders.js";

const router = Router();

router.get("/google", (req, res) => {
  const url = oauth2Client.generateAuthUrl({
    access_type: "offline",
    prompt: "consent",
    scope: [
      "https://www.googleapis.com/auth/gmail.readonly",
      "https://www.googleapis.com/auth/gmail.send",
    ],
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
          "utf8",
        );
      } else if (email.data.payload?.parts) {
        const textPart = email.data.payload.parts.find(
          (part) => part.mimeType === "text/plain",
        );

        if (textPart?.body?.data) {
          body = Buffer.from(textPart.body.data, "base64").toString("utf8");
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
    console.error(error);

    res.status(500).json({
      message: "Błąd pobierania maili",
      error: error?.message,
    });
  }
});

router.get("/latest-email-ai", async (req, res) => {
  try {
    if (!savedTokens) {
      return res.status(401).json({
        message: "Brak tokena",
      });
    }

    oauth2Client.setCredentials(savedTokens);

    const gmail = google.gmail({
      version: "v1",
      auth: oauth2Client,
    });

    const listResponse = await gmail.users.messages.list({
      userId: "me",
      maxResults: 40,
    });

    const lastMessageId = await getLastMessageId();

    let message = null;

    for (const msg of listResponse.data.messages || []) {
      if (msg.id === lastMessageId) {
        break;
      }

      const full = await gmail.users.messages.get({
        userId: "me",
        id: msg.id!,
        format: "metadata",
      });

      const from =
        full.data.payload?.headers?.find((h) => h.name === "From")?.value || "";

      if (!from.includes("aidlasklepuzdronamidji@gmail.com")) {
        message = msg;
        break;
      }
    }

    if (!message) {
      return res.json({
        message: "Brak nowych wiadomości",
      });
    }

    const email = await gmail.users.messages.get({
      userId: "me",
      id: message.id!,
      format: "full",
    });

    const threadId = email.data.threadId!;
    console.log("THREAD ID:", threadId);

    const headers = email.data.payload?.headers || [];

    const messageId = headers.find((h) => h.name === "Message-ID")?.value || "";

    const references =
      headers.find((h) => h.name === "References")?.value || "";

    const inReplyTo =
      headers.find((h) => h.name === "In-Reply-To")?.value || "";

    const subject =
      headers.find((h) => h.name === "Subject")?.value || "Brak tematu";

    const from =
      headers.find((h) => h.name === "From")?.value || "Nieznany nadawca";

    let body = "";

    if (email.data.payload?.body?.data) {
      body = Buffer.from(email.data.payload.body.data, "base64").toString(
        "utf8",
      );
    } else if (email.data.payload?.parts) {
      const textPart = email.data.payload.parts.find(
        (part) => part.mimeType === "text/plain",
      );

      if (textPart?.body?.data) {
        body = Buffer.from(textPart.body.data, "base64").toString("utf8");
      }
    }

    body = body
      .split(/napisał\(a\):|On .*wrote:|Od:/)[0]
      .replace(/^>.*$/gm, "")
      .trim();

    const analysis = await analyzeEmail(threadId, from, subject, body);

    await saveConversation(
      threadId,
      from,
      body,
      analysis.email_response,
      analysis.product_name,
    );

    await sendEmail(
      from,
      subject,
      analysis.email_response,
      threadId,
      messageId,
      references,
      inReplyTo,
    );

    await saveLastMessageId(message.id!);

    res.json({
      email: {
        subject,
        from,
        body,
      },
      analysis,
    });
  } catch (error: any) {
    console.error(error);

    res.status(500).json({
      message: "Błąd",
      error: error?.message,
    });
  }
});

export default router;
