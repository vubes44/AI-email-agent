import { GoogleGenAI } from "@google/genai";
import { getProducts } from "./products.js";
import { getConversation } from "./conversations.js";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export async function analyzeEmail(
  threadId: string,
  email: string,
  subject: string,
  body: string,
) {
  const products = await getProducts();

  const conversation = await getConversation(threadId);

  let conversationContext = "Brak wcześniejszej rozmowy.";

  if (conversation?.messages?.length) {
    conversationContext = conversation.messages
      .map(
        (message: any) =>
          `${message.role === "user" ? "Klient" : "AI"}: ${message.content}`,
      )
      .join("\n\n");
  }

  const currentProduct = conversation?.currentProduct || "Brak";

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

Aktualnie rekomendowany produkt:

${currentProduct}

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
gdy klient jednoznacznie deklaruje zakup.

Jeżeli klient pyta o produkt:
- ustaw intent = "product_question"

Jeżeli nie wiadomo:
- ustaw intent = "unknown"

BARDZO WAŻNE ZASADY:

1. Historia rozmowy jest NAJWAŻNIEJSZA.

2. Jeżeli wcześniej poleciłeś produkt, kolejne pytania dotyczą właśnie jego.

3. Nie zmieniaj rekomendowanego produktu samodzielnie.

4. Pytania typu:
- jaki ma zasięg?
- jaki ma czas lotu?
- ile waży?
- czy ma omijanie przeszkód?
- jakie ma funkcje?
- czy nagrywa 4K?

dotyczą ostatnio poleconego produktu.

5. Produkt zmieniaj WYŁĄCZNIE gdy klient wyraźnie napisze:
- pokaż coś innego
- chcę tańszy
- chcę droższy
- zmieniłem zdanie
- wybierz inny model

6. Nigdy nie zmieniaj produktu sam z siebie.

7. Odpowiadaj zgodnie z historią rozmowy.

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
