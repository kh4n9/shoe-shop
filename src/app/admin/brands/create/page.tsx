"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createBrand } from "@/services/admin/brand";

interface Brand {
  name: string;
  description: string;
}

export default function CreateBrandPage() {
  const router = useRouter();
  const [brand, setBrand] = useState<Brand>({
    name: "",
    description: "",
  });

  const handleSave = async () => {
    try {
      await createBrand(brand);
      router.push("/admin/brands");
    } catch (error) {
      console.error("Error creating brand:", error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-8">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          Thêm thương hiệu mới
        </h1>
        <form onSubmit={handleSave} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-gray-700 font-medium">
              Tên thương hiệu
            </Label>
            <Input
              id="name"
              value={brand.name}
              onChange={(e) => setBrand({ ...brand, name: e.target.value })}
              className="w-full"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description" className="text-gray-700 font-medium">
              Mô tả
            </Label>
            <Textarea
              id="description"
              value={brand.description}
              onChange={(e) =>
                setBrand({ ...brand, description: e.target.value })
              }
              className="w-full"
              rows={4}
            />
          </div>
          <div className="flex justify-end space-x-4 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/admin/brands")}
              className="text-gray-700"
            >
              Hủy
            </Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
              Lưu
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
