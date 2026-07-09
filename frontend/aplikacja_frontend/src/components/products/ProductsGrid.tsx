import ProductCard from "./ProductCard";

interface Product {
  id: string;
  name: string;
  variant: string;
  price: number;
  currency: string;
  quantity: number;
  active: boolean;
}

interface ProductsGridProps {
  products: Product[];
}

export default function ProductsGrid({
  products,
}: ProductsGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">

      {products.map((product) => (
        <ProductCard
          key={product.id}
          name={product.name}
          variant={product.variant}
          price={product.price}
          currency={product.currency}
          quantity={product.quantity}
          active={product.active}
        />
      ))}

    </div>
  );
}