"use client";

import { useEffect, useState } from "react";
import { orderService, Order } from "@/services/orderService";
import { getMe } from "@/services/auth/me";
import { format } from "date-fns";
import { getProductById } from "@/services/public/home/product";

interface ProductInfo {
  _id: string;
  name: string;
  price: number;
  images: string[];
}

export default function OrderHistoryPage() {
  const [user, setUser] = useState<{ _id: string } | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [productDetails, setProductDetails] = useState<
    Record<string, ProductInfo>
  >({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserAndOrders = async () => {
      try {
        setLoading(true);
        // Get current user
        const response = await getMe();
        setUser(response.user);

        if (response.user?._id) {
          // Fetch orders for the user
          const userOrders = await orderService.getUserOrders(
            response.user._id
          );
          setOrders(userOrders);

          // Fetch product details for all products in orders
          const productIds = new Set<string>();
          userOrders.forEach((order) => {
            order.products.forEach((product) => {
              productIds.add(product.productId);
            });
          });

          const productDetailsMap: Record<string, ProductInfo> = {};
          for (const productId of productIds) {
            try {
              const product = await getProductById(productId);
              productDetailsMap[productId] = product;
            } catch (err) {
              console.error(`Error fetching product ${productId}:`, err);
            }
          }

          setProductDetails(productDetailsMap);
        }
      } catch (err) {
        setError("Không thể tải đơn hàng. Vui lòng thử lại sau.");
        console.error("Error fetching orders:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserAndOrders();
  }, []);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">
            Vui lòng đăng nhập để xem đơn hàng của bạn
          </h1>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center text-red-600">
          <h1 className="text-2xl font-bold mb-4">{error}</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Lịch sử đơn hàng
        </h1>

        {orders.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <p className="text-gray-500">Bạn chưa đặt hàng nào cả.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div
                key={order._id}
                className="bg-white rounded-lg shadow overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900">
                        Đơn hàng #{order._id?.slice(-6)}
                      </h2>
                      <p className="text-sm text-gray-500">
                        {order.createdAt &&
                          format(new Date(order.createdAt), "PPP")}
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium
                      ${
                        order.status === "completed"
                          ? "bg-green-100 text-green-800"
                          : order.status === "processing"
                          ? "bg-blue-100 text-blue-800"
                          : order.status === "cancelled"
                          ? "bg-red-100 text-red-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {order.status === "completed"
                        ? "Đã hoàn thành"
                        : order.status === "processing"
                        ? "Đang xử lý"
                        : order.status === "cancelled"
                        ? "Đã hủy"
                        : "Đang chờ"}
                    </span>
                  </div>

                  <div className="border-t border-gray-200 pt-4">
                    <h3 className="text-sm font-medium text-gray-900 mb-2">
                      Sản phẩm
                    </h3>
                    <div className="space-y-2">
                      {order.products?.map((product, index) => {
                        const productInfo = productDetails[product.productId];
                        return (
                          <div
                            key={index}
                            className="flex justify-between text-sm"
                          >
                            <div className="flex items-center">
                              {productInfo?.images?.[0] && (
                                <img
                                  src={productInfo.images[0]}
                                  alt={productInfo?.name || "Sản phẩm"}
                                  className="w-12 h-12 object-cover rounded mr-3"
                                />
                              )}
                              <div>
                                <span className="font-medium text-gray-900">
                                  {productInfo?.name ||
                                    `Sản phẩm #${product.productId}`}
                                </span>
                                <span className="text-gray-500 ml-2">
                                  ({product.quantity}x, {product.size},{" "}
                                  {product.color})
                                </span>
                              </div>
                            </div>
                            <span className="text-gray-900">
                              {productInfo
                                ? (
                                    productInfo.price * product.quantity
                                  ).toLocaleString("vi-VN") + "đ"
                                : "N/A"}
                            </span>
                          </div>
                        );
                      }) || (
                        <p className="text-sm text-gray-500">
                          Không có sản phẩm trong đơn hàng này
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="border-t border-gray-200 mt-4 pt-4">
                    <div className="flex justify-between text-base font-medium">
                      <span>Tổng tiền</span>
                      <span>{order.totalPrice?.toLocaleString("vi-VN")}đ</span>
                    </div>
                  </div>

                  <div className="border-t border-gray-200 mt-4 pt-4">
                    <h3 className="text-sm font-medium text-gray-900 mb-2">
                      Thông tin khách hàng
                    </h3>
                    <p className="text-sm text-gray-600">
                      Tên: {order.name || "Chưa cung cấp"}
                      <br />
                      Email: {order.email || "Chưa cung cấp"}
                      <br />
                      Số điện thoại: {order.phone || "Chưa cung cấp"}
                      <br />
                      Địa chỉ: {order.address || "Chưa cung cấp"}
                      <br />
                      Phương thức thanh toán:{" "}
                      {order.paymentMethod === "momo"
                        ? "Momo"
                        : order.paymentMethod === "banking"
                        ? "Chuyển khoản ngân hàng"
                        : order.paymentMethod === "cod"
                        ? "Thanh toán khi nhận hàng"
                        : "Chưa xác định"}
                      <br />
                      {order.note && <span>Ghi chú: {order.note}</span>}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
