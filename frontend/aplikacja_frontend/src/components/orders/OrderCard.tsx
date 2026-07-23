interface OrderCardProps {
  id: string;
  customer_name: string | null;
  customer_email: string;
  threadId: string;
  product_name: string;
  variant: string;
  quantity: number;
  price: number;
  status: string;
  created_at: {
    _seconds: number;
    _nanoseconds: number;
  };
}

export default function OrderCard({
  id,
  customer_name,
  customer_email,
  product_name,
  variant,
  quantity,
  price,
  status,
  created_at,
}: OrderCardProps) {
  const date = new Date(created_at._seconds * 1000);

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-lg transition p-5">

      <div className="flex items-center justify-between mb-4">

        <h2 className="text-lg font-bold text-gray-900">
          Zamówienie #{id.slice(0, 6)}
        </h2>

        <span
          className={`px-3 py-1 rounded-full text-sm font-semibold ${
            status === "new"
              ? "bg-green-100 text-green-700"
              : "bg-gray-100 text-gray-700"
          }`}
        >
          {status}
        </span>

      </div>

      <div className="space-y-2 text-sm">

        <p>
          <span className="font-semibold">Klient:</span>{" "}
          {customer_name || "Brak danych"}
        </p>

        <p>
          <span className="font-semibold">Email:</span>{" "}
          {customer_email}
        </p>

        <p>
          <span className="font-semibold">Produkt:</span>{" "}
          {product_name}
        </p>

        <p>
          <span className="font-semibold">Wariant:</span>{" "}
          {variant}
        </p>

        <p>
          <span className="font-semibold">Ilość:</span>{" "}
          {quantity}
        </p>

        <p>
          <span className="font-semibold">Cena:</span>{" "}
          {price} zł
        </p>

        <p>
          <span className="font-semibold">Data:</span>{" "}
          {date.toLocaleString("pl-PL")}
        </p>

      </div>

    </div>
  );
}