interface ProductCardProps {
  image: string;
  name: string;
  variant: string;
  price: number;
  currency: string;
  quantity: number;
  active: boolean;
}

export default function ProductCard({
  image,
  name,
  variant,
  price,
  currency,
  quantity,
  active,
}: ProductCardProps) {
  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-lg transition duration-300">

      <div className="h-52 bg-gray-100 flex items-center justify-center">
        <img
          src={image}
          alt={name}
          className="max-h-full max-w-full object-contain p-4"
        />
      </div>

      <div className="p-5 space-y-4">

        <div>
          <h2 className="text-xl font-bold text-gray-900">
            {name}
          </h2>

          <p className="text-gray-500 mt-1">
            {variant}
          </p>
        </div>

        <div className="text-2xl font-bold text-gray-900">
          {price} {currency}
        </div>

        <div className="flex items-center justify-between">

          <div>
            <p className="text-sm text-gray-500">
              Stan magazynowy
            </p>

            <p className="font-semibold">
              {quantity} szt.
            </p>
          </div>

          <div
            className={`px-3 py-1 rounded-full text-sm font-semibold ${
              active
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {active ? "Dostępny" : "Niedostępny"}
          </div>

        </div>

      </div>
    </div>
  );
}