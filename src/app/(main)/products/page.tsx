"use client";

import { getProducts } from "@/services/public/home/product";
import { useEffect, useState } from "react";
import ProductCard from "@/app/(main)/products/product-card";

interface Product {
  _id: string;
  name: string;
  price: number;
  images: string[];
  category: string;
  brand: string;
}

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await getProducts();
        console.log(response);
        setProducts(response);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className="container mx-auto px-4 py-4">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-4">
          <h1 className="text-2xl font-bold">Sản phẩm</h1>
          <p className="text-gray-500">
            Dưới đây là danh sách tất cả sản phẩm của chúng tôi
          </p>
        </div>
        <div className="flex flex-wrap gap-4">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
}
