"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { createOrder } from "@/services/public/order";
import { toast } from "sonner";

interface CartItem {
  productId: string;
  name: string;
  price: number;
  image: string;
  size: string;
  color: string;
  quantity: number;
}

export default function CheckoutPage() {
  const router = useRouter();
  const [cartItems, setCartItems] = React.useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [paymentMethod, setPaymentMethod] = React.useState("cod");
  const [formData, setFormData] = React.useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    note: "",
  });

  React.useEffect(() => {
    // Get cart items from localStorage
    const cart = localStorage.getItem("cart");
    if (cart) {
      setCartItems(JSON.parse(cart));
    }
    setIsLoading(false);
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const calculateSubtotal = () => {
    return cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  };

  const calculateShipping = () => {
    // Free shipping for orders over 5,000,000 VND
    return calculateSubtotal() > 5000000 ? 0 : 50000;
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateShipping();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    if (!formData.fullName || !formData.phone || !formData.address) {
      toast.error("Vui lòng điền đầy đủ thông tin giao hàng");
      return;
    }

    if (cartItems.length === 0) {
      toast.error("Giỏ hàng của bạn đang trống");
      return;
    }

    setIsSubmitting(true);

    try {
      // Prepare order data
      const orderData = {
        items: cartItems.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          size: item.size,
          color: item.color,
        })),
        shippingAddress: formData.address,
        phone: formData.phone,
        note: formData.note,
        paymentMethod: paymentMethod as "cod" | "bank" | "momo",
      };

      // Create order
      await createOrder(orderData);

      // Clear cart
      localStorage.removeItem("cart");

      // Show success message
      toast.success("Đặt hàng thành công!");

      // Redirect to success page
      router.push("/checkout/success");
    } catch (error) {
      console.error("Error creating order:", error);
      toast.error("Có lỗi xảy ra khi đặt hàng. Vui lòng thử lại sau.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <div className="container mx-auto px-4 py-8">Đang tải...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Thanh toán</h1>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Shipping Information */}
            <Card>
              <CardHeader>
                <CardTitle>Thông tin giao hàng</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Họ và tên</Label>
                    <Input
                      id="fullName"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Số điện thoại</Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Địa chỉ</Label>
                  <Input
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                    placeholder="Nhập địa chỉ giao hàng đầy đủ"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="note">Ghi chú</Label>
                  <Input
                    id="note"
                    name="note"
                    value={formData.note}
                    onChange={handleInputChange}
                    placeholder="Ghi chú về đơn hàng, vị trí giao hàng, v.v."
                  />
                </div>
              </CardContent>
            </Card>

            {/* Payment Method */}
            <Card>
              <CardHeader>
                <CardTitle>Phương thức thanh toán</CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup
                  value={paymentMethod}
                  onValueChange={setPaymentMethod}
                  className="space-y-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="cod" id="cod" />
                    <Label htmlFor="cod">Thanh toán khi nhận hàng (COD)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="bank" id="bank" />
                    <Label htmlFor="bank">Chuyển khoản ngân hàng</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="momo" id="momo" />
                    <Label htmlFor="momo">Ví MoMo</Label>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Đơn hàng của bạn</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {cartItems.map((item) => (
                    <div
                      key={item.productId}
                      className="flex justify-between text-sm"
                    >
                      <span>
                        {item.name} x {item.quantity}
                      </span>
                      <span>
                        {(item.price * item.quantity).toLocaleString("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        })}
                      </span>
                    </div>
                  ))}
                  <div className="border-t pt-4 space-y-2">
                    <div className="flex justify-between">
                      <span>Tạm tính</span>
                      <span>
                        {calculateSubtotal().toLocaleString("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        })}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Phí vận chuyển</span>
                      <span>
                        {calculateShipping() === 0 ? (
                          <span className="text-green-500">Miễn phí</span>
                        ) : (
                          calculateShipping().toLocaleString("vi-VN", {
                            style: "currency",
                            currency: "VND",
                          })
                        )}
                      </span>
                    </div>
                    <div className="border-t pt-2">
                      <div className="flex justify-between font-bold">
                        <span>Tổng cộng</span>
                        <span>
                          {calculateTotal().toLocaleString("vi-VN", {
                            style: "currency",
                            currency: "VND",
                          })}
                        </span>
                      </div>
                    </div>
                  </div>
                  <Button
                    type="submit"
                    className="w-full"
                    size="lg"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Đang xử lý..." : "Đặt hàng"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
}
