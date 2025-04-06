"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getOrders } from "@/services/admin/order";
import { getUsers } from "@/services/admin/user";
import { useEffect, useState } from "react";

interface Order {
  id: string;
  totalPrice: number;
  status: string;
  createdAt: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

export default function Dashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    getOrders().then((orders) => setOrders(orders));
    getUsers().then((users) => setUsers(users));
  }, []);

  // Hàm tính số lượng items (đơn hàng hoặc khách hàng) trong tháng và năm cụ thể
  const getMonthlyCount = (
    items: { createdAt: string }[],
    month: number,
    year: number
  ) => {
    return items.filter((item) => {
      const date = new Date(item.createdAt);
      return date.getMonth() === month && date.getFullYear() === year;
    }).length;
  };

  // Hàm tính tổng doanh thu của đơn hàng trong tháng cụ thể
  const getMonthlyRevenue = (month: number, year: number) => {
    return orders
      .filter((order) => {
        const orderDate = new Date(order.createdAt);
        return (
          orderDate.getMonth() === month && orderDate.getFullYear() === year
        );
      })
      .reduce((acc, order) => acc + order.totalPrice, 0);
  };

  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  // Xử lý trường hợp tháng trước nếu hiện tại là tháng 0
  let prevMonth = currentMonth - 1;
  let prevYear = currentYear;
  if (prevMonth < 0) {
    prevMonth = 11;
    prevYear = currentYear - 1;
  }

  // Tính số đơn hàng trong tháng
  const currentOrderCount = getMonthlyCount(orders, currentMonth, currentYear);
  const prevOrderCount = getMonthlyCount(orders, prevMonth, prevYear);
  const orderGrowth =
    prevOrderCount === 0
      ? "N/A"
      : (((currentOrderCount - prevOrderCount) / prevOrderCount) * 100).toFixed(
          2
        );

  // Tính tổng doanh thu
  const currentRevenue = getMonthlyRevenue(currentMonth, currentYear);
  const prevRevenue = getMonthlyRevenue(prevMonth, prevYear);
  const revenueGrowth =
    prevRevenue === 0
      ? "N/A"
      : (((currentRevenue - prevRevenue) / prevRevenue) * 100).toFixed(2);

  // Tính số khách hàng mới (chỉ những người đăng ký trong tháng)
  const currentUserCount = getMonthlyCount(users, currentMonth, currentYear);
  const prevUserCount = getMonthlyCount(users, prevMonth, prevYear);
  const userGrowth =
    prevUserCount === 0
      ? "N/A"
      : (((currentUserCount - prevUserCount) / prevUserCount) * 100).toFixed(2);

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Tổng số đơn hàng trong tháng so với tháng trước */}
        <Card>
          <CardHeader>
            <CardTitle>Tổng số đơn hàng trong tháng</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{currentOrderCount} đơn hàng</p>
            <p className="text-sm text-gray-500">
              {prevOrderCount} đơn hàng tháng trước (
              {orderGrowth === "N/A"
                ? "Không có dữ liệu"
                : `${Number(orderGrowth) > 0 ? "+" : ""}${orderGrowth}%`}
              )
            </p>
          </CardContent>
        </Card>
        {/* Tổng doanh thu trong tháng và % tăng trưởng so với tháng trước */}
        <Card>
          <CardHeader>
            <CardTitle>Tổng doanh thu trong tháng</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {currentRevenue.toLocaleString("vi-VN", {
                style: "currency",
                currency: "VND",
              })}
              <br />
              <span className="text-sm text-gray-500">
                {revenueGrowth === "N/A"
                  ? "Không có dữ liệu tháng trước"
                  : `${
                      Number(revenueGrowth) > 0 ? "+" : ""
                    }${revenueGrowth}% so với tháng trước`}
              </span>
            </p>
          </CardContent>
        </Card>
        {/* Khách hàng mới trong tháng so với tháng trước */}
        <Card>
          <CardHeader>
            <CardTitle>Khách hàng mới trong tháng</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{currentUserCount}</p>
            <p className="text-sm text-gray-500">
              {prevUserCount} khách hàng tháng trước (
              {userGrowth === "N/A"
                ? "Không có dữ liệu"
                : `${Number(userGrowth) > 0 ? "+" : ""}${userGrowth}%`}
              )
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
