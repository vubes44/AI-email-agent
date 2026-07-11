const API_URL = "http://localhost:3000";

export async function getDashboardStats() {
  const response = await fetch(`${API_URL}/dashboard/stats`);

  if (!response.ok) {
    throw new Error("Nie udało się pobrać statystyk.");
  }

  return response.json();
}

export async function getProducts() {
  const response = await fetch(`${API_URL}/products`);

  if (!response.ok) {
    throw new Error("Nie udało się pobrać produktów.");
  }

  return response.json();
}

export async function getOrders() {
  const response = await fetch(`${API_URL}/orders`);

  if (!response.ok) {
    throw new Error("Nie udało się pobrać zamówień.");
  }

  return response.json();
}

export async function getConversations() {
  const response = await fetch(`${API_URL}/conversations`);

  if (!response.ok) {
    throw new Error("Nie udało się pobrać rozmów.");
  }

  return response.json();
}
