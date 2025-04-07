"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2 } from "lucide-react";
import { getProductById } from "@/services/public/home/product";

interface CartItem {
  productId: string;
  name: string;
  price: number;
  image: string;
  size: string;
  color: string;
  quantity: number;
}

export default function CartPage() {
  const router = useRouter();
  const [cartItems, setCartItems] = React.useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  // Load cart items from localStorage
  React.useEffect(() => {
    const cart = localStorage.getItem("cart");
    if (cart) {
      setCartItems(JSON.parse(cart));
    }
    setIsLoading(false);
  }, []);

  // Update product images when cartItems changes
  React.useEffect(() => {
    if (cartItems.length === 0) return;

    const updateImages = async () => {
      setIsLoading(true);
      try {
        const updatedCartItems = await Promise.all(
          cartItems.map(async (item) => {
            try {
              const product = await getProductById(item.productId);
              return { ...item, image: product.images[0] };
            } catch (error) {
              console.error(`Error fetching product ${item.productId}:`, error);
              return item; // Keep original item if there's an error
            }
          })
        );
        setCartItems(updatedCartItems);
      } catch (error) {
        console.error("Error updating cart images:", error);
      } finally {
        setIsLoading(false);
      }
    };

    updateImages();
  }, [cartItems.length]); // Only run when the number of items changes

  // Save cart to localStorage when it changes
  React.useEffect(() => {
    if (cartItems.length > 0) {
      localStorage.setItem("cart", JSON.stringify(cartItems));
    } else {
      localStorage.removeItem("cart");
    }
  }, [cartItems]);

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    if (newQuantity < 1) return;

    // Update state
    setCartItems((prevItems) => {
      const updatedItems = prevItems.map((item) =>
        item.productId === productId ? { ...item, quantity: newQuantity } : item
      );

      // Update localStorage directly
      if (updatedItems.length > 0) {
        localStorage.setItem("cart", JSON.stringify(updatedItems));
      } else {
        localStorage.removeItem("cart");
      }

      return updatedItems;
    });
  };

  const handleRemoveItem = (productId: string) => {
    setCartItems((prevItems) =>
      prevItems.filter((item) => item.productId !== productId)
    );
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

  if (isLoading) {
    return <div className="container mx-auto px-4 py-8">Đang tải...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Giỏ hàng</h1>

      {cartItems.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-gray-500 mb-4">Giỏ hàng của bạn đang trống</p>
            <Button onClick={() => router.push("/products")}>
              Tiếp tục mua sắm
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Sản phẩm trong giỏ hàng</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {cartItems.map((item) => (
                    <div
                      key={item.productId}
                      className="flex items-center gap-4 py-4 border-b last:border-b-0"
                    >
                      <div className="relative w-24 h-24 flex-shrink-0">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover rounded-md"
                        />
                      </div>
                      <div className="flex-grow">
                        <h3 className="font-medium">{item.name}</h3>
                        <p className="text-sm text-gray-500">
                          Kích thước: {item.size} | Màu: {item.color}
                        </p>
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                handleQuantityChange(
                                  item.productId,
                                  item.quantity - 1
                                )
                              }
                            >
                              -
                            </Button>
                            <span className="w-8 text-center">
                              {item.quantity}
                            </span>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                handleQuantityChange(
                                  item.productId,
                                  item.quantity + 1
                                )
                              }
                            >
                              +
                            </Button>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveItem(item.productId)}
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">
                          {(item.price * item.quantity).toLocaleString(
                            "vi-VN",
                            {
                              style: "currency",
                              currency: "VND",
                            }
                          )}
                        </p>
                        <p className="text-sm text-gray-500">
                          {item.price.toLocaleString("vi-VN", {
                            style: "currency",
                            currency: "VND",
                          })}{" "}
                          / sản phẩm
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle>Tổng đơn hàng</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
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
                  <div className="border-t pt-4">
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
                  <Button
                    className="w-full"
                    size="lg"
                    onClick={() => router.push("/checkout")}
                  >
                    Thanh toán
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => router.push("/products")}
                  >
                    Tiếp tục mua sắm
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
