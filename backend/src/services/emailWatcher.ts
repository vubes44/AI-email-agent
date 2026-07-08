import { google } from "googleapis";
import { oauth2Client } from "../config/google.js";
import * as googleConfig from "../config/google.js";
import { analyzeEmail } from "./gemini.js";
import { saveConversation } from "./conversations.js";
import { sendEmail } from "./gmail.js";
import { getLastMessageId, saveLastMessageId } from "./settings.js";
import { createOrder } from "./orders.js";
import { decreaseProductQuantity } from "./products.js";

export async function checkLatestEmail() {
  console.log("🔄 Sprawdzam Gmail...");

  if (!googleConfig.savedTokens) {
    console.log("❌ Brak tokenów Google");
    return;
  }

  oauth2Client.setCredentials(googleConfig.savedTokens);

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
    if (msg.id === lastMessageId) break;

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
    return;
  }

  // zapisujemy od razu, żeby drugi watcher nie analizował tej samej wiadomości
  await saveLastMessageId(message.id!);

  const email = await gmail.users.messages.get({
    userId: "me",
    id: message.id!,
    format: "full",
  });

  const threadId = email.data.threadId!;

  console.log("THREAD:", threadId);

  const headers = email.data.payload?.headers || [];

  const messageId = headers.find((h) => h.name === "Message-ID")?.value || "";

  const references = headers.find((h) => h.name === "References")?.value || "";

  const inReplyTo = headers.find((h) => h.name === "In-Reply-To")?.value || "";

  const subject = headers.find((h) => h.name === "Subject")?.value || "";

  const from = headers.find((h) => h.name === "From")?.value || "";

  let body = "";

  if (email.data.payload?.body?.data) {
    body = Buffer.from(email.data.payload.body.data, "base64").toString("utf8");
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

  if (analysis.intent === "new_order") {
    await createOrder({
      threadId,
      customer_name: analysis.customer_name,
      customer_email: from,
      product_name: analysis.product_name,
      variant: analysis.variant,
      quantity: analysis.quantity,
      price: analysis.price,
    });

    await decreaseProductQuantity(analysis.product_name, analysis.variant);
  }

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

  console.log("✅ Mail obsłużony");
}
