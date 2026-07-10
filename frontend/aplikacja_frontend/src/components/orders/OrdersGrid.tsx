import OrderCard from "./OrderCard";

interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  productName: string;
  variant: string;
  quantity: number;
  price: number;
  status: string;
}

interface OrdersGridProps {
  orders: Order[];
}

export default function OrdersGrid({
  orders,
}: OrdersGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">

      {orders.map((order) => (
        <OrderCard
          key={order.id}
          orderId={order.id}
          customerName={order.customerName}
          customerEmail={order.customerEmail}
          productName={order.productName}
          variant={order.variant}
          quantity={order.quantity}
          price={order.price}
          status={order.status}
        />
      ))}

    </div>
  );
}