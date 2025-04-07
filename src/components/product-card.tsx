import Image from "next/image";
import { getBrandById } from "@/services/public/home/brand";
import { getCategoryById } from "@/services/public/home/category";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

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

export default function ProductCard({ product }: { product: Product }) {
  const router = useRouter();
  const [brand, setBrand] = useState<Brand | null>(null);
  useEffect(() => {
    const fetchBrand = async () => {
      const brand = await getBrandById(product.brand);
      setBrand(brand);
    };
    fetchBrand();
  }, [product.brand]);
  const [category, setCategory] = useState<Category | null>(null);
  useEffect(() => {
    const fetchCategory = async () => {
      const category = await getCategoryById(product.category);
      setCategory(category);
    };
    fetchCategory();
  }, [product.category]);
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
            <a
              href={`/products/${product._id}`}
              className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
            >
              Chi tiết sản phẩm
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
