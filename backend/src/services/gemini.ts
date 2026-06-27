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

BARDZO WAŻNE ZASADY:

1. Historia rozmowy jest najważniejszym źródłem kontekstu.

2. Jeżeli wcześniej poleciłeś klientowi konkretny produkt, wszystkie kolejne pytania dotyczą właśnie tego produktu.

3. NIE zmieniaj rekomendowanego produktu samodzielnie.

4. Jeżeli klient pyta:
- jaki ma czas lotu?
- jaki ma zasięg?
- ile waży?
- czy nagrywa w 4K?
- czy ma D-Log?
- jakie ma kamery?
- czy warto?
- czy ma omijanie przeszkód?

to odpowiedz o OSTATNIO poleconym produkcie z historii rozmowy.

5. Zmień rekomendację WYŁĄCZNIE wtedy, gdy klient wyraźnie napisze np.:
- pokaż coś innego
- zmieniłem zdanie
- chcę tańszy model
- chcę droższy model
- potrzebuję czegoś z dłuższym czasem lotu
- szukam czegoś innego

6. Nigdy nie zmieniaj polecanego modelu tylko dlatego, że inny produkt ma lepszy parametr.

7. Jeżeli w historii rozmowy poleciłeś na przykład DJI Mavic 4 Pro, a klient pyta "ile waży?" lub "jaki ma zasięg?", odpowiedz o DJI Mavic 4 Pro.

Jeżeli klient pyta o rekomendację produktu:

- wybierz JEDEN najlepszy produkt z bazy,
- nie podawaj alternatyw,
- nie porównuj kilku modeli,
- chyba że klient wyraźnie poprosi o porównanie.

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
