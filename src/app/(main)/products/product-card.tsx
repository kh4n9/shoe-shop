import Image from "next/image";
import { getBrandById } from "@/services/admin/brand";
import { getCategoryById } from "@/services/admin/category";
import { useEffect, useState } from "react";

interface Product {
  _id: string;
  name: string;
  price: number;
  images: string[];
  category: string;
  brand: string;
}

interface Brand {
  _id: string;
  name: string;
}

interface Category {
  _id: string;
  name: string;
}

export default function ProductCard({ product }: { product: Product }) {
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
    <div className="w-full max-w-sm bg-white border border-gray-200 rounded-lg shadow-sm">
      <a href="#">
        <Image
          className="p-8 rounded-t-lg"
          src={product.images[0]}
          alt={product.name}
          width={500}
          height={300}
          style={{ objectFit: "scale-down" }}
        />
      </a>
      <div className="px-5 pb-5">
        <a href="#">
          <h5 className="text-xl font-semibold tracking-tight text-gray-900">
            {product.name}
          </h5>
        </a>
        <div className="flex items-center justify-between mb-2 gap-2">
          <span className="text-sm text-gray-500 font-bold">
            Thương hiệu: {brand?.name.toUpperCase()}
          </span>
          <span className="text-sm text-gray-500 font-bold">
            Loại: {category?.name.toUpperCase()}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-3xl font-bold text-gray-900">
            {product.price.toLocaleString("vi-VN", {
              style: "currency",
              currency: "VND",
            })}
          </span>
          <a
            href="#"
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
          >
            Add to cart
          </a>
        </div>
      </div>
    </div>
  );
}
