import OrderCard from "./OrderCard";

interface Order {
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

interface OrdersGridProps {
  orders: Order[];
}

export default function OrdersGrid({ orders }: OrdersGridProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
      {orders.map((order) => (
        <OrderCard
          key={order.id}
          id={order.id}
          customer_name={order.customer_name}
          customer_email={order.customer_email}
          threadId={order.threadId}
          product_name={order.product_name}
          variant={order.variant}
          quantity={order.quantity}
          price={order.price}
          status={order.status}
          created_at={order.created_at}
        />
      ))}
    </div>
  );
}