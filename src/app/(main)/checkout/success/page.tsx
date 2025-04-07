"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";

export default function CheckoutSuccessPage() {
  const router = useRouter();

  return (
    <div className="container mx-auto px-4 py-16">
      <Card className="max-w-2xl mx-auto">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <CheckCircle2 className="h-16 w-16 text-green-500" />
            </div>
            <h1 className="text-2xl font-bold">Đặt hàng thành công!</h1>
            <p className="text-gray-500">
              Cảm ơn bạn đã mua hàng. Chúng tôi sẽ gửi email xác nhận đơn hàng
              của bạn trong thời gian sớm nhất.
            </p>
            <div className="pt-4 space-x-4">
              <Button onClick={() => router.push("/orders")}>
                Xem đơn hàng
              </Button>
              <Button
                variant="outline"
                onClick={() => router.push("/products")}
              >
                Tiếp tục mua sắm
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
