import Image from "next/image";
import { getBrandById } from "@/services/public/home/brand";
import { getCategoryById } from "@/services/public/home/category";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

interface Product {
  _id: string;
  name: string;
  price: number;
  images: string[];
  category: string;
  brand: string;
  description: string;
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

interface ProductCardProps {
  product: Product;
  viewMode: "grid" | "list";
}

export default function ProductCard({ product, viewMode }: ProductCardProps) {
  const router = useRouter();
  const [brand, setBrand] = useState<Brand | null>(null);
  const [category, setCategory] = useState<Category | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const [brandData, categoryData] = await Promise.all([
        getBrandById(product.brand),
        getCategoryById(product.category),
      ]);
      setBrand(brandData);
      setCategory(categoryData);
    };
    fetchData();
  }, [product.brand, product.category]);

  if (viewMode === "list") {
    return (
      <div
        onClick={() => router.push(`/products/${product._id}`)}
        className="w-full bg-white border border-gray-200 rounded-lg shadow-sm flex flex-row h-48 cursor-pointer hover:shadow-lg transition-all duration-300"
      >
        <div className="relative w-48 h-full">
          <Image
            className="rounded-l-lg object-cover"
            src={product.images[0]}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
        <div className="p-4 flex flex-col flex-grow">
          <h5 className="text-xl font-semibold tracking-tight text-gray-900 line-clamp-2 mb-2">
            {product.name}
          </h5>
          <div className="flex items-center gap-4 mb-2">
            <span className="text-sm text-gray-500 font-bold">
              {brand?.name.toUpperCase()}
            </span>
            <span className="text-sm text-gray-500 font-bold">
              {category?.name.toUpperCase()}
            </span>
          </div>
          <p className="text-gray-600 line-clamp-2 mb-4">
            {product.description}
          </p>
          <div className="mt-auto flex items-center justify-between">
            <span className="text-2xl font-bold text-gray-900">
              {product.price.toLocaleString("vi-VN", {
                style: "currency",
                currency: "VND",
              })}
            </span>
            <Button
              onClick={(e) => {
                e.stopPropagation();
                router.push(`/products/${product._id}`);
              }}
            >
              Chi tiết sản phẩm
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={() => router.push(`/products/${product._id}`)}
      className="w-full bg-white border border-gray-200 rounded-lg shadow-sm flex flex-col h-[500px] cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105"
    >
      <div className="relative w-full h-96">
        <Image
          className="rounded-t-lg object-cover"
          src={product.images[0]}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <h5 className="text-xl font-semibold tracking-tight text-gray-900 line-clamp-2 mb-2">
          {product.name}
        </h5>
        <div className="flex items-center justify-between mb-2 gap-2">
          <span className="text-sm text-gray-500 font-bold truncate">
            {brand?.name.toUpperCase()}
          </span>
          <span className="text-sm text-gray-500 font-bold truncate">
            {category?.name.toUpperCase()}
          </span>
        </div>
        <div className="mt-auto">
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold text-gray-900">
              {product.price.toLocaleString("vi-VN", {
                style: "currency",
                currency: "VND",
              })}
            </span>
            <Button
              onClick={(e) => {
                e.stopPropagation();
                router.push(`/products/${product._id}`);
              }}
            >
              Chi tiết sản phẩm
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
