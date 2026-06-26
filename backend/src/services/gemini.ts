import { GoogleGenAI } from "@google/genai";
import { getProducts } from "./products.js";
import { getConversation } from "./conversations.js";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export async function analyzeEmail(
  email: string,
  subject: string,
  body: string,
) {
  const products = await getProducts();

  const conversation = await getConversation(email);

  let conversationContext = "Brak wcześniejszej rozmowy.";

  if (conversation?.messages?.length) {
    conversationContext = conversation.messages
      .map(
        (message: any) =>
          `${message.role === "user" ? "Klient" : "AI"}: ${message.content}`,
      )
      .join("\n\n");
  }

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

Historia rozmowy z klientem:

${conversationContext}

Nowa wiadomość klienta:

TEMAT:
${subject}

TREŚĆ:
${body}

Przeanalizuj wiadomość klienta.

Jeżeli klient pyta jaki dron wybrać:
- dobierz najlepszy model z bazy
- uwzględnij budżet
- uwzględnij zastosowanie
- zaproponuj konkretny wariant

Jeżeli klient tylko pyta o rekomendację,
porównanie modeli, budżet lub wybór produktu:
- ustaw intent = "product_question"

Ustaw intent = "new_order" WYŁĄCZNIE wtedy,
gdy klient jednoznacznie deklaruje zakup,
np.:
- kupuję
- biorę
- zamawiam
- proszę o realizację zamówienia
- chcę zamówić

Jeżeli klient pyta o produkt:
- ustaw intent = "product_question"

Jeżeli nie wiadomo:
- ustaw intent = "unknown"

Jeżeli klient zadaje krótkie pytanie (np. "jaki ma zasięg?", "a czas lotu?", "czy ma D-Log?"), wykorzystaj historię rozmowy, aby ustalić, o który produkt chodzi.

Zwróć WYŁĄCZNIE poprawny JSON.

Format:

{
  "intent": "",
  "customer_name": "",
  "product_name": "",
  "budget": null,
  "email_response": ""
}
`;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
  });

  const text = response.text || "";

  const cleaned = text.replace("```json", "").replace("```", "").trim();

  return JSON.parse(cleaned);
}
