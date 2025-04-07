"use client";

import CarouselSpacing from "@/app/(main)/carousel";
import { getProducts } from "@/services/public/home/product";
import { getBestSellingProducts } from "@/services/public/home/product";
import { useEffect, useState } from "react";

interface Product {
  _id: string;
  name: string;
  price: number;
  images: string[];
  category: string;
  brand: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}
const Home = () => {
  const [newProducts, setNewProducts] = useState<Product[]>([]);
  const [bestSellingProducts, setBestSellingProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Lấy danh mục sản phẩm mới nhất
    const fetchNewProducts = async () => {
      const response = await getProducts();
      setNewProducts(response.slice(0, 10));
    };
    fetchNewProducts();
    // Lấy danh mục sản phẩm bán chạy nhất
    const fetchBestSellingProducts = async () => {
      const response = await getBestSellingProducts();
      setBestSellingProducts(response.slice(0, 10));
    };
    fetchBestSellingProducts();
  }, []);

  useEffect(() => {
    if (newProducts.length > 0 && bestSellingProducts.length > 0) {
      setLoading(false);
    }
  }, [newProducts, bestSellingProducts]);

  return (
    <div className="container mx-auto mt-10 space-y-10">
      <div className="flex flex-col items-center justify-center space-y-10">
        <h1 className="text-3xl font-bold">DANH MỤC SẢN PHẨM MỚI NHẤT</h1>
        {loading ? (
          <p>Đang tải sản phẩm...</p>
        ) : (
          <CarouselSpacing products={newProducts} />
        )}
      </div>
      {/* Danh mục những sản phẩm bán chạy nhất */}
      <div className="flex flex-col items-center justify-center space-y-10">
        <h1 className="text-3xl font-bold">DANH MỤC SẢN PHẨM BÁN CHẠY NHẤT</h1>
        {loading ? (
          <p>Đang tải sản phẩm...</p>
        ) : (
          <CarouselSpacing products={bestSellingProducts} />
        )}
      </div>
    </div>
  );
};

export default Home;
