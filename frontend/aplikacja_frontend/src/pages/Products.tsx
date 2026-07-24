import { useEffect, useState } from "react";

import ProductsGrid from "../components/products/ProductsGrid";
import { getProducts } from "../services/api";

interface Product {
  id: string;
  name: string;
  variant: string;
  price: number;
  currency: string;
  quantity: number;
  active: boolean;

  description: string;
  category: string;

  weight: number;
  flight_time: number;
  transmission_range: number;

  cmos: string;
  photo_resolution: string;
  video_resolution: string;

  max_speed: string;
  obstacle_sensing: string;

  intelligent_flight_features: string[];

  created_at: any;
  updated_at: any;
}

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    async function loadProducts() {
      try {
        const data = await getProducts();

        console.log("PRODUCTS:", data);

        setProducts(data);
      } catch (error) {
        console.error(error);
      }
    }

    loadProducts();
  }, []);

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-gray-900">
        Produkty
      </h1>

      <ProductsGrid products={products} />
    </div>
  );
}