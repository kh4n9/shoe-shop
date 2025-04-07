"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import BrandTable from "./brand-table";

export default function BrandsPage() {
  const router = useRouter();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Quản lý thương hiệu
        </h1>
        <Button
          onClick={() => router.push("/admin/brands/create")}
          className="bg-blue-600 hover:bg-blue-700"
        >
          Thêm thương hiệu mới
        </Button>
      </div>
      <BrandTable />
    </div>
  );
}
