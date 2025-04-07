"use client";

import { getProductById, updateProduct } from "@/services/admin/product";
import { getCategories, getCategoryById } from "@/services/admin/category";
import { getBrands, getBrandById } from "@/services/admin/brand";
import { useEffect } from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Image from "next/image";

interface EditProductPageProps {
  params: {
    id: string;
  };
}

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

interface Category {
  _id: string;
  name: string;
}

interface Brand {
  _id: string;
  name: string;
}

export default function EditProductPage({ params }: EditProductPageProps) {
  const { id } = params;
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [images, setImages] = useState<string[]>([]);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [category, setCategory] = useState<Category | null>(null);
  const [brand, setBrand] = useState<Brand | null>(null);

  useEffect(() => {
    getProductById(id).then((product) => {
      setProduct(product);
      setImages(product.images);
      getCategoryById(product.category).then((category) =>
        setCategory(category)
      );
      getBrandById(product.brand).then((brand) => setBrand(brand));
    });
    getCategories().then((categories) => setCategories(categories));
    getBrands().then((brands) => setBrands(brands));
  }, [id]);

  const handleSave = () => {
    if (!product?._id) return;
    updateProduct(product._id, product).then(() => {
      router.push("/admin/products");
    });
  };

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

      setImages([...images, ...newImages]);
      if (product) {
        setProduct({ ...product, images: [...product.images, ...newImages] });
      }
    } catch (error) {
      console.error("Error uploading images:", error);
    } finally {
      setIsUploading(false);
      setSelectedImages([]);
    }
  };

  const handleDeleteImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    setImages(newImages);
    if (product) {
      setProduct({ ...product, images: newImages });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">{product?.name}</h1>
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
            value={product?.name}
            onChange={(e) => {
              if (product) {
                setProduct({ ...product, name: e.target.value });
              }
            }}
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
            value={product?.price}
            onChange={(e) => {
              if (product) {
                setProduct({ ...product, price: Number(e.target.value) });
              }
            }}
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
            value={product?.description}
            onChange={(e) => {
              if (product) {
                setProduct({ ...product, description: e.target.value });
              }
            }}
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
            defaultValue={category?._id}
            value={category?._id}
            onValueChange={(value) => {
              getCategoryById(value).then((category) => setCategory(category));
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Chọn danh mục" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category._id} value={category._id}>
                  {category.name}
                </SelectItem>
              ))}
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
            defaultValue={brand?._id}
            value={brand?._id}
            onValueChange={(value) => {
              getBrandById(value).then((brand) => setBrand(brand));
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Chọn thương hiệu" />
            </SelectTrigger>
            <SelectContent>
              {brands.map((brand) => (
                <SelectItem key={brand._id} value={brand._id}>
                  {brand.name}
                </SelectItem>
              ))}
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
            {product?.sizes.map((size, index) => (
              <div
                key={index}
                className="flex items-center bg-gray-100 rounded-md px-3 py-1"
              >
                <span>{size}</span>
                <Button
                  variant="outline"
                  onClick={() => {
                    if (product) {
                      setProduct({
                        ...product,
                        sizes: product.sizes.filter((_, i) => i !== index),
                      });
                    }
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
                  if (product) {
                    setProduct({
                      ...product,
                      sizes: [...product.sizes, e.currentTarget.value.trim()],
                    });
                    e.currentTarget.value = "";
                  }
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
            {product?.colors.map((color, index) => (
              <div
                key={index}
                className="flex items-center bg-gray-100 rounded-md px-3 py-1"
              >
                <span>{color}</span>
                <Button
                  variant="outline"
                  onClick={() => {
                    if (product) {
                      setProduct({
                        ...product,
                        colors: product.colors.filter((_, i) => i !== index),
                      });
                    }
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
                  if (product) {
                    setProduct({
                      ...product,
                      colors: [...product.colors, e.currentTarget.value.trim()],
                    });
                    e.currentTarget.value = "";
                  }
                }
              }}
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label
            htmlFor="images"
            className="block text-sm font-medium text-gray-700"
          >
            Hình ảnh sản phẩm
          </Label>
          <div className="grid grid-cols-4 gap-4 mb-4">
            {images.map((image, index) => (
              <div key={index} className="relative group">
                <Image
                  src={image}
                  alt={`Product image ${index + 1}`}
                  className="w-full h-32 object-cover rounded-lg"
                  width={100}
                  height={100}
                />
                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => handleDeleteImage(index)}
                ></Button>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <Input
              type="file"
              id="images"
              multiple
              accept="image/*"
              onChange={handleImageChange}
              className="flex-1"
            />
            <Button
              onClick={handleUploadImages}
              disabled={selectedImages.length === 0 || isUploading}
            >
              {isUploading ? "Đang tải..." : "Tải lên"}
            </Button>
          </div>
        </div>
        <div className="pt-4">
          <Button onClick={handleSave}>Lưu</Button>
        </div>
      </div>
    </div>
  );
}
