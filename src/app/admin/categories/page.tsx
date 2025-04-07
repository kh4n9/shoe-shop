"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import CategoryTable from "@/app/admin/categories/category-table";

export default function CategoriesPage() {
  const router = useRouter();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Quản lý danh mục</h1>
        <Button onClick={() => router.push("/admin/categories/create")}>
          Thêm danh mục mới
        </Button>
      </div>
      <CategoryTable />
    </div>
  );
}
