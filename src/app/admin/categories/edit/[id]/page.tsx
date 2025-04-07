"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { getCategoryById, updateCategory } from "@/services/admin/category";

interface EditCategoryPageProps {
  params: {
    id: string;
  };
}

interface Category {
  _id: string;
  name: string;
  description: string;
}

export default function EditCategoryPage({ params }: EditCategoryPageProps) {
  const { id } = params;
  const router = useRouter();
  const [category, setCategory] = useState<Category | null>(null);

  useEffect(() => {
    getCategoryById(id).then((category) => setCategory(category));
  }, [id]);

  const handleSave = async () => {
    if (!category?._id) return;
    try {
      await updateCategory(category);
      router.push("/admin/categories");
    } catch (error) {
      console.error("Error updating category:", error);
    }
  };

  if (!category) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">{category.name}</h1>
      <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
        <div className="space-y-2">
          <Label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700"
          >
            Tên danh mục
          </Label>
          <Input
            type="text"
            id="name"
            value={category.name}
            onChange={(e) => setCategory({ ...category, name: e.target.value })}
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
            value={category.description}
            onChange={(e) =>
              setCategory({ ...category, description: e.target.value })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px]"
          />
        </div>
        <div className="flex justify-end gap-4">
          <Button
            variant="outline"
            onClick={() => router.push("/admin/categories")}
          >
            Hủy
          </Button>
          <Button onClick={handleSave}>Lưu</Button>
        </div>
      </div>
    </div>
  );
}
