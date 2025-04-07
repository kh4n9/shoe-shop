"use client";

import { useState, useEffect } from "react";
import { getCategories } from "@/services/admin/category";
import { getBrands } from "@/services/admin/brand";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Image from "next/image";

interface Category {
  _id: string;
  name: string;
}

interface Brand {
  _id: string;
  name: string;
}

interface Product {
  name: string;
  price: number;
  description: string;
  category: string;
  brand: string;
  sizes: string[];
  colors: string[];
  images: string[];
}

export default function CreateProductPage() {
  const router = useRouter();
  const [product, setProduct] = useState<Product>({
    name: "",
    price: 0,
    description: "",
    category: "",
    brand: "",
    sizes: [],
    colors: [],
    images: [],
  });
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);

  useEffect(() => {
    getCategories().then((categories) => setCategories(categories));
    getBrands().then((brands) => setBrands(brands));
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedImages(Array.from(e.target.files));
    }
  };

  const handleUploadImages = async () => {
    if (selectedImages.length === 0) return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      selectedImages.forEach((file) => {
        formData.append("files", file);
      });

      const response = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const data = await response.json();
      const newImages = data.urls;
      setProduct({ ...product, images: [...product.images, ...newImages] });
    } catch (error) {
      console.error("Error uploading images:", error);
    } finally {
      setIsUploading(false);
      setSelectedImages([]);
    }
  };

  const handleDeleteImage = (index: number) => {
    const newImages = product.images.filter((_, i) => i !== index);
    setProduct({ ...product, images: newImages });
  };

  const handleSave = async () => {
    try {
      const response = await fetch("/api/admin/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(product),
      });

      if (!response.ok) {
        throw new Error("Failed to create product");
      }

      router.push("/admin/products");
    } catch (error) {
      console.error("Error creating product:", error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">
        Thêm sản phẩm mới
      </h1>
      <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
        <div className="space-y-2">
          <Label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700"
          >
            Tên sản phẩm
          </Label>
          <Input
            type="text"
            id="name"
            value={product.name}
            onChange={(e) => setProduct({ ...product, name: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="space-y-2">
          <Label
            htmlFor="price"
            className="block text-sm font-medium text-gray-700"
          >
            Giá
          </Label>
          <Input
            type="number"
            id="price"
            value={product.price}
            onChange={(e) =>
              setProduct({ ...product, price: Number(e.target.value) })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="space-y-2">
          <Label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700"
          >
            Mô tả
          </Label>
          <Textarea
            id="description"
            value={product.description}
            onChange={(e) =>
              setProduct({ ...product, description: e.target.value })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px]"
          />
        </div>
        <div className="space-y-2">
          <Label
            htmlFor="category"
            className="block text-sm font-medium text-gray-700"
          >
            Danh mục
          </Label>
          <Select
            value={product.category}
            onValueChange={(value) =>
              setProduct({ ...product, category: value })
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Chọn danh mục" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Danh mục</SelectLabel>
                {categories.map((cat) => (
                  <SelectItem key={cat._id} value={cat._id}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label
            htmlFor="brand"
            className="block text-sm font-medium text-gray-700"
          >
            Thương hiệu
          </Label>
          <Select
            value={product.brand}
            onValueChange={(value) => setProduct({ ...product, brand: value })}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Chọn thương hiệu" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Thương hiệu</SelectLabel>
                {brands.map((b) => (
                  <SelectItem key={b._id} value={b._id}>
                    {b.name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label
            htmlFor="sizes"
            className="block text-sm font-medium text-gray-700"
          >
            Kích cỡ
          </Label>
          <div className="flex flex-wrap gap-2 mb-2">
            {product.sizes.map((size, index) => (
              <div
                key={index}
                className="flex items-center bg-gray-100 rounded-md px-3 py-1"
              >
                <span>{size}</span>
                <Button
                  variant="outline"
                  onClick={() => {
                    setProduct({
                      ...product,
                      sizes: product.sizes.filter((_, i) => i !== index),
                    });
                  }}
                  className="ml-2 text-red-500 hover:text-red-700"
                >
                  ×
                </Button>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <Input
              type="text"
              id="sizes"
              placeholder="Thêm kích cỡ mới"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              onKeyDown={(e) => {
                if (e.key === "Enter" && e.currentTarget.value.trim()) {
                  setProduct({
                    ...product,
                    sizes: [...product.sizes, e.currentTarget.value.trim()],
                  });
                  e.currentTarget.value = "";
                }
              }}
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label
            htmlFor="colors"
            className="block text-sm font-medium text-gray-700"
          >
            Màu sắc
          </Label>
          <div className="flex flex-wrap gap-2 mb-2">
            {product.colors.map((color, index) => (
              <div
                key={index}
                className="flex items-center bg-gray-100 rounded-md px-3 py-1"
              >
                <span>{color}</span>
                <Button
                  variant="outline"
                  onClick={() => {
                    setProduct({
                      ...product,
                      colors: product.colors.filter((_, i) => i !== index),
                    });
                  }}
                  className="ml-2 text-red-500 hover:text-red-700"
                >
                  ×
                </Button>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <Input
              type="text"
              id="colors"
              placeholder="Thêm màu mới"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              onKeyDown={(e) => {
                if (e.key === "Enter" && e.currentTarget.value.trim()) {
                  setProduct({
                    ...product,
                    colors: [...product.colors, e.currentTarget.value.trim()],
                  });
                  e.currentTarget.value = "";
                }
              }}
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label className="block text-sm font-medium text-gray-700">
            Hình ảnh
          </Label>
          <div className="grid grid-cols-4 gap-4 mb-4">
            {product.images.map((image, index) => (
              <div key={index} className="relative">
                <Image
                  src={image}
                  alt={`Product image ${index + 1}`}
                  width={200}
                  height={200}
                  className="rounded-lg object-cover"
                />
                <Button
                  variant="outline"
                  onClick={() => handleDeleteImage(index)}
                  className="absolute top-2 right-2 bg-white text-red-500 hover:text-red-700"
                >
                  ×
                </Button>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <Input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageChange}
              className="flex-1"
            />
            <Button
              onClick={handleUploadImages}
              disabled={selectedImages.length === 0 || isUploading}
            >
              {isUploading ? "Đang tải lên..." : "Tải lên"}
            </Button>
          </div>
        </div>
        <div className="flex justify-end gap-4">
          <Button
            variant="outline"
            onClick={() => router.push("/admin/products")}
          >
            Hủy
          </Button>
          <Button onClick={handleSave}>Lưu</Button>
        </div>
      </div>
    </div>
  );
}
