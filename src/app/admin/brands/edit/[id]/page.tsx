"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { getBrandById, updateBrand } from "@/services/admin/brand";

interface EditBrandPageProps {
  params: {
    id: string;
  };
}

interface Brand {
  _id: string;
  name: string;
  description: string;
}

export default function EditBrandPage({ params }: EditBrandPageProps) {
  const { id } = params;
  const router = useRouter();
  const [brand, setBrand] = useState<Brand | null>(null);

  useEffect(() => {
    getBrandById(id).then((brand) => setBrand(brand));
  }, [id]);

  const handleSave = async () => {
    if (!brand?._id) return;
    try {
      await updateBrand(brand);
      router.push("/admin/brands");
    } catch (error) {
      console.error("Error updating brand:", error);
    }
  };

  if (!brand) {
    return (
      <div className="max-w-2xl mx-auto py-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="text-center text-gray-500">Đang tải...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-8">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          Chỉnh sửa thương hiệu: {brand.name}
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
