import { google } from "googleapis";
import { oauth2Client, savedTokens } from "../config/google.js";

export async function sendEmail(
  to: string,
  subject: string,
  body: string,
  threadId: string,
  messageId: string,
  references: string,
  inReplyTo: string,
) {
  if (!savedTokens) {
    throw new Error("Brak tokenów Google.");
  }

  oauth2Client.setCredentials(savedTokens);

  const gmail = google.gmail({
    version: "v1",
    auth: oauth2Client,
  });

  const message = [
    `To: ${to}`,
    `Subject: Re: ${subject}`,
    `In-Reply-To: ${messageId}`,
    `References: ${references ? references + " " : ""}${messageId}`,
    "Content-Type: text/plain; charset=utf-8",
    "",
    body,
  ].join("\n");

  const encodedMessage = Buffer.from(message)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");

  await gmail.users.messages.send({
    userId: "me",
    requestBody: {
      threadId,
      raw: encodedMessage,
    },
  });

  console.log("📧 Mail wysłany w thread:", threadId);
}
