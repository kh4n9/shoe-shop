"use client";

import OrderTable from "./order-table";

export default function OrdersPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Quản lý đơn hàng</h1>
      <OrderTable />
    </div>
  );
}
