interface OrderCardProps {
  orderId: string;
  customerName: string;
  customerEmail: string;
  productName: string;
  variant: string;
  quantity: number;
  price: number;
  status: string;
}

export default function OrderCard({
  orderId,
  customerName,
  customerEmail,
  productName,
  variant,
  quantity,
  price,
  status,
}: OrderCardProps) {
  const statusColor =
    status === "Nowe"
      ? "bg-blue-100 text-blue-700"
      : status === "W realizacji"
      ? "bg-yellow-100 text-yellow-700"
      : status === "Wysłane"
      ? "bg-green-100 text-green-700"
      : "bg-gray-100 text-gray-700";

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-lg transition duration-300">

      <div className="p-5 space-y-4">

        <div className="flex justify-between items-start">

          <div>
            <h2 className="text-xl font-bold text-gray-900">
              Zamówienie #{orderId}
            </h2>

            <p className="text-gray-500">
              {customerName}
            </p>

            <p className="text-sm text-gray-400">
              {customerEmail}
            </p>
          </div>

          <span
            className={`px-3 py-1 rounded-full text-sm font-semibold ${statusColor}`}
          >
            {status}
          </span>

        </div>

        <div>

          <p className="font-semibold text-gray-900">
            {productName}
          </p>

          <p className="text-gray-500">
            {variant}
          </p>

        </div>

        <div className="flex justify-between items-center">

          <div>

            <p className="text-sm text-gray-500">
              Ilość
            </p>

            <p className="font-semibold">
              {quantity} szt.
            </p>

          </div>

          <div className="text-right">

            <p className="text-sm text-gray-500">
              Wartość
            </p>

            <p className="text-xl font-bold">
              {price} PLN
            </p>

          </div>

        </div>

      </div>

    </div>
  );
}