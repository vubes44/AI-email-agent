import { GoogleGenAI } from "@google/genai";
import { getProducts } from "./products.js";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export async function analyzeEmail(subject: string, body: string) {
  const products = await getProducts();

  const productsContext = products
    .map(
      (product: any) => `
Nazwa: ${product.name}
Wariant: ${product.variant}
Cena: ${product.price} PLN
Czas lotu: ${product.flight_time} min
Kamera: ${product.photo_resolution}
Video: ${product.video_resolution}
Opis: ${product.description}
`,
    )
    .join("\n----------------------\n");

  const prompt = `
Jesteś profesjonalnym doradcą sklepu DJI.

Masz odpowiadać WYŁĄCZNIE na podstawie produktów znajdujących się w bazie.

Dostępne produkty:

${productsContext}

Przeanalizuj wiadomość klienta.

Jeżeli klient pyta jaki dron wybrać:
- dobierz najlepszy model z bazy
- uwzględnij budżet
- uwzględnij zastosowanie
- zaproponuj konkretny wariant

Jeżeli klient chce kupić produkt:
- ustaw intent = "new_order"

Jeżeli klient pyta o produkt:
- ustaw intent = "product_question"

Jeżeli nie wiadomo:
- ustaw intent = "unknown"

Zwróć WYŁĄCZNIE poprawny JSON.

Format:

{
  "intent": "",
  "customer_name": "",
  "product_name": "",
  "budget": null,
  "email_response": ""
}

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
