"use client";

import * as React from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getProductById } from "@/services/public/home/product";
import { getBrandById } from "@/services/public/home/brand";
import { getCategoryById } from "@/services/public/home/category";
import { addToCart } from "@/services/public/home/cart";

interface Product {
  _id: string;
  name: string;
  price: number;
  description: string;
  images: string[];
  category: string;
  brand: string;
  sizes: string[];
  colors: string[];
}

interface Brand {
  _id: string;
  name: string;
  description: string;
}

interface Category {
  _id: string;
  name: string;
  description: string;
}

export default function ProductDetail() {
  const params = useParams();
  const [product, setProduct] = React.useState<Product | null>(null);
  const [brand, setBrand] = React.useState<Brand | null>(null);
  const [category, setCategory] = React.useState<Category | null>(null);
  const [selectedSize, setSelectedSize] = React.useState<string>("");
  const [selectedColor, setSelectedColor] = React.useState<string>("");
  const [quantity, setQuantity] = React.useState(1);
  const [currentImageIndex, setCurrentImageIndex] = React.useState(0);

  React.useEffect(() => {
    const fetchProduct = async () => {
      try {
        const productData = await getProductById(params.id as string);
        setProduct(productData);
        const brandData = await getBrandById(productData.brand);
        setBrand(brandData);
        const categoryData = await getCategoryById(productData.category);
        setCategory(categoryData);
        setSelectedSize(
          productData.sizes.length > 0 ? productData.sizes[0] : ""
        );
        setSelectedColor(
          productData.colors.length > 0 ? productData.colors[0] : ""
        );
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };
    fetchProduct();
  }, [params.id]);

  const handleAddToCart = () => {
    if (!selectedSize || !selectedColor) {
      alert("Vui lòng chọn kích thước và màu sắc");
      return;
    }
    // TODO: Implement add to cart functionality
    if (product) {
      console.log(product._id, selectedSize, selectedColor, quantity);
      addToCart(product._id, selectedSize, selectedColor, quantity);
      alert("Đã thêm vào giỏ hàng");
    }
  };

  if (!product) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Image Gallery */}
        <div className="space-y-4">
          <div className="relative w-full aspect-square">
            <Image
              src={product.images[currentImageIndex]}
              alt={product.name}
              fill
              className="object-cover rounded-lg"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
          <div className="grid grid-cols-4 gap-2">
            {product.images.map((image, index) => (
              <div
                key={index}
                className={`relative aspect-square cursor-pointer ${
                  currentImageIndex === index ? "ring-2 ring-blue-500" : ""
                }`}
                onClick={() => setCurrentImageIndex(index)}
              >
                <Image
                  src={image}
                  alt={`${product.name} ${index + 1}`}
                  fill
                  className="object-cover rounded-md"
                  sizes="(max-width: 768px) 25vw, 15vw"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">{product.name}</h1>
            <div className="flex items-center gap-4 mt-2">
              <span className="text-gray-500">Thương hiệu: {brand?.name}</span>
              <span className="text-gray-500">Danh mục: {category?.name}</span>
            </div>
          </div>

          <div className="text-3xl font-bold text-blue-600">
            {product.price.toLocaleString("vi-VN", {
              style: "currency",
              currency: "VND",
            })}
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Kích thước
              </label>
              <Select
                value={selectedSize}
                onValueChange={setSelectedSize}
                defaultValue={product.sizes.length > 0 ? product.sizes[0] : ""}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn kích thước" />
                </SelectTrigger>
                <SelectContent>
                  {product.sizes.map((size) => (
                    <SelectItem key={size} value={size}>
                      {size}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Màu sắc</label>
              <Select
                value={selectedColor}
                onValueChange={setSelectedColor}
                defaultValue={
                  product.colors.length > 0 ? product.colors[0] : ""
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn màu sắc" />
                </SelectTrigger>
                <SelectContent>
                  {product.colors.map((color) => (
                    <SelectItem key={color} value={color}>
                      {color}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Số lượng</label>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                >
                  -
                </Button>
                <span className="w-12 text-center">{quantity}</span>
                <Button
                  variant="outline"
                  onClick={() => setQuantity(quantity + 1)}
                >
                  +
                </Button>
              </div>
            </div>
          </div>

          <Button className="w-full" size="lg" onClick={handleAddToCart}>
            Thêm vào giỏ hàng
          </Button>

          <Card>
            <CardContent className="pt-6">
              <h2 className="text-xl font-semibold mb-4">Mô tả sản phẩm</h2>
              <p className="text-gray-600 whitespace-pre-line">
                {product.description}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
