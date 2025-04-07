"use client";

import * as React from "react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import { getOrders } from "@/services/admin/order";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

interface Order {
  id: string;
  totalPrice: number;
  status: string;
  createdAt: string;
}

type ChartKey = "revenue" | "growth";

const chartConfig = {
  revenue: {
    label: "Doanh thu",
    color: "hsl(var(--chart-1))",
  },
  growth: {
    label: "Tăng trưởng",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

export default function Chart() {
  const [activeChart, setActiveChart] = React.useState<ChartKey>("revenue");
  const [orders, setOrders] = React.useState<Order[]>([]);

  React.useEffect(() => {
    getOrders().then((orders) => setOrders(orders));
  }, []);

  const chartData = React.useMemo(() => {
    // Get the last 30 days
    const today = new Date();
    const thirtyDaysAgo = new Date(today);
    thirtyDaysAgo.setDate(today.getDate() - 30);

    // Create an array of the last 30 days
    const dates = Array.from({ length: 31 }, (_, i) => {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      return date.toISOString().split("T")[0];
    }).reverse();

    // Calculate daily revenue
    const dailyRevenue = dates.map((date) => {
      const dayOrders = orders.filter(
        (order) => order.createdAt.split("T")[0] === date
      );
      const revenue = dayOrders.reduce(
        (sum, order) => sum + order.totalPrice,
        0
      );
      return { date, revenue };
    });

    // Calculate growth
    const result = dailyRevenue.map((day, index) => {
      const previousDay = dailyRevenue[index - 1];
      let growth = 0;

      if (previousDay && previousDay.revenue > 0) {
        growth =
          ((day.revenue - previousDay.revenue) / previousDay.revenue) * 100;
      }

      return {
        date: day.date,
        revenue: day.revenue,
        growth: Number(growth.toFixed(2)),
      };
    });

    return result;
  }, [orders]);

  const total = React.useMemo(
    () => ({
      revenue: chartData.reduce((acc, curr) => acc + curr.revenue, 0),
      growth: chartData[chartData.length - 1]?.growth || 0,
    }),
    [chartData]
  );

  return (
    <Card>
      <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
          <CardTitle>Biểu đồ thống kê doanh thu 30 ngày gần nhất</CardTitle>
          <CardDescription>
            Theo dõi doanh thu và tỷ lệ tăng trưởng theo ngày
          </CardDescription>
        </div>
        <div className="flex">
          {(["revenue", "growth"] as const).map((key) => {
            const chart = key;
            return (
              <button
                key={chart}
                data-active={activeChart === chart}
                className="relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l data-[active=true]:bg-muted/50 sm:border-l sm:border-t-0 sm:px-8 sm:py-6"
                onClick={() => setActiveChart(chart)}
              >
                <span className="text-xs text-muted-foreground">
                  {chartConfig[chart].label}
                </span>
                <span className="text-lg font-bold leading-none sm:text-3xl">
                  {key === "revenue"
                    ? total[key].toLocaleString() + "đ"
                    : total[key].toFixed(2) + "%"}
                </span>
              </button>
            );
          })}
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <BarChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value: string) => {
                const date = new Date(value);
                return date.toLocaleDateString("vi-VN", {
                  month: "short",
                  day: "numeric",
                });
              }}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="w-[150px]"
                  nameKey={activeChart}
                  labelFormatter={(value: string) => {
                    return new Date(value).toLocaleDateString("vi-VN", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    });
                  }}
                />
              }
            />
            <Bar dataKey={activeChart} fill={chartConfig[activeChart].color} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
