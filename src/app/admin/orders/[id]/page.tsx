"use client";

import * as React from "react";
import { useParams } from "next/navigation";
import { getOrderById } from "@/services/admin/order";
import { getProductById } from "@/services/admin/product";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface OrderProduct {
  productId: string;
  quantity: number;
  size: string;
  color: string;
}

interface Order {
  _id: string;
  userId: string;
  products: OrderProduct[];
  totalPrice: number;
  status: string;
  createdAt: string;
}

interface Product {
  _id: string;
  name: string;
  price: number;
  images: string[];
}

export default function OrderDetail() {
  const params = useParams();
  const router = useRouter();
  const [order, setOrder] = React.useState<Order | null>(null);
  const [products, setProducts] = React.useState<Record<string, Product>>({});

  React.useEffect(() => {
    if (params.id) {
      getOrderById(params.id as string).then((orderData) => {
        setOrder(orderData);
        // Fetch product details for each product in the order
        const productPromises = orderData.products.map(
          (product: OrderProduct) =>
            getProductById(product.productId).then((productData) => ({
              id: product.productId,
              data: productData,
            }))
        );
        Promise.all(productPromises).then((results) => {
          const productMap = results.reduce((acc, { id, data }) => {
            acc[id] = data;
            return acc;
          }, {} as Record<string, Product>);
          setProducts(productMap);
        });
      });
    }
  }, [params.id]);

  if (!order) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Chi tiết đơn hàng</h1>
        <Button variant="outline" onClick={() => router.back()}>
          Quay lại
        </Button>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Thông tin đơn hàng</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Mã đơn hàng</p>
                <p className="font-medium">{order._id}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">ID người dùng</p>
                <p className="font-medium">{order.userId}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Trạng thái</p>
                <p className="font-medium">{order.status}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Ngày tạo</p>
                <p className="font-medium">
                  {new Date(order.createdAt).toLocaleDateString("vi-VN", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Danh sách sản phẩm</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {order.products.map((product, index) => {
                const productData = products[product.productId];
                return (
                  <div
                    key={index}
                    className="flex items-center justify-between border-b pb-4"
                  >
                    <div className="flex items-center space-x-4">
                      {productData?.images?.[0] && (
                        <Image
                          src={productData.images[0]}
                          alt={productData?.name}
                          className="w-16 h-16 object-cover rounded"
                          width={64}
                          height={64}
                        />
                      )}
                      <div>
                        <p className="font-medium">{productData?.name}</p>
                        <p className="text-sm text-gray-500">
                          Kích thước: {product.size} | Màu: {product.color}
                        </p>
                        <p className="text-sm text-gray-500">
                          Số lượng: {product.quantity}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">
                        {(
                          (productData?.price || 0) * product.quantity
                        ).toLocaleString("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        })}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tổng thanh toán</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <p className="text-lg font-medium">Tổng tiền</p>
              <p className="text-2xl font-bold">
                {order.totalPrice.toLocaleString("vi-VN", {
                  style: "currency",
                  currency: "VND",
                })}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
