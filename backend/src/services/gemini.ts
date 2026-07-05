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
    .map((product: any) => {
      return Object.entries(product)
        .map(([key, value]) => {
          if (Array.isArray(value)) {
            return `${key}: ${value.join(", ")}`;
          }

          return `${key}: ${value}`;
        })
        .join("\n");
    })
    .join("\n\n----------------------\n\n");

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
gdy klient jednoznacznie potwierdza zakup konkretnego produktu.

Przykłady:

- kupuję
- biorę
- zamawiam
- poproszę ten model
- proszę przygotować zamówienie
- chcę go kupić
- decyduję się na zakup
- wezmę ten model

Nigdy NIE ustawiaj "new_order", jeżeli klient:

- pyta o parametry,
- pyta o cenę,
- pyta o dostępność,
- pyta o porównanie,
- prosi o rekomendację,
- dopytuje o szczegóły produktu.

W takich przypadkach ustaw "product_question".

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

8. Każdy produkt zawiera komplet parametrów technicznych.

Jeżeli klient pyta o:
- wagę,
- zasięg transmisji,
- prędkość,
- kamerę,
- sensory,
- funkcje inteligentne,
- czas lotu,
- rozdzielczość,
- dowolny parametr techniczny,

odpowiadaj wyłącznie na podstawie pól przekazanych przy tym produkcie.

Nie pisz, że nie masz informacji, jeżeli parametr znajduje się w danych produktu.

Zwróć WYŁĄCZNIE poprawny JSON.

Format:

Format:

{
  "intent": "",
  "customer_name": "",
  "customer_email": "",
  "product_name": "",
  "variant": "",
  "price": 0,
  "quantity": 1,
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
