import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export async function analyzeEmail(subject: string, body: string) {
  const prompt = `
Jesteś asystentem sklepu z dronami DJI.

Przeanalizuj mail klienta.

Zwróć WYŁĄCZNIE poprawny JSON.

Format:

{
  "intent": "",
  "customer_name": "",
  "product_name": "",
  "budget": null,
  "email_response": ""
}

Możliwe intent:
- product_question
- new_order
- order_status
- support
- unknown

TEMAT:
${subject}

TREŚĆ:
${body}
`;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
  });

  const text = response.text || "";

  const cleaned = text.replace("```json", "").replace("```", "").trim();

  return JSON.parse(cleaned);
}
