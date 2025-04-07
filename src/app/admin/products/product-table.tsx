"use client";

import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { deleteProduct, getProducts } from "@/services/admin/product";
import { getCategories } from "@/services/admin/category";
import { getBrands } from "@/services/admin/brand";
import { useRouter } from "next/navigation";

interface Product {
  _id: string;
  name: string;
  price: number;
  description: string;
  images: string[];
  category: string;
  brand: string;
  sizes: string[];
  colors: string[];
}

interface Category {
  _id: string;
  name: string;
}

interface Brand {
  _id: string;
  name: string;
}

export default function ProductTable() {
  const [data, setData] = React.useState<Product[]>([]);
  const [categories, setCategories] = React.useState<Category[]>([]);
  const [brands, setBrands] = React.useState<Brand[]>([]);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const router = useRouter();

  React.useEffect(() => {
    getProducts().then((products) => setData(products));
    getCategories().then((categories) => setCategories(categories));
    getBrands().then((brands) => setBrands(brands));
  }, []);

  const handleDelete = React.useCallback((id: string) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa sản phẩm này?")) {
      deleteProduct(id).then(() => {
        setData((prev) => prev.filter((product) => product._id !== id));
      });
    }
  }, []);

  const handleEdit = React.useCallback(
    (id: string) => {
      router.push(`/admin/products/edit/${id}`);
    },
    [router]
  );

  // Map dữ liệu để thay thế id danh mục/brand thành tên (nếu có)
  const mappedData = React.useMemo(() => {
    return data.map((product) => {
      const categoryName =
        categories.find((c) => c._id === product.category)?.name || "";
      const brandName = brands.find((b) => b._id === product.brand)?.name || "";
      return {
        ...product,
        category: categoryName,
        brand: brandName,
      };
    });
  }, [data, categories, brands]);

  const columns = React.useMemo<ColumnDef<Product>[]>(
    () => [
      {
        accessorKey: "name",
        header: "Tên sản phẩm",
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: "price",
        header: "Giá",
        cell: (info) =>
          info.getValue<number>().toLocaleString("vi-VN", {
            style: "currency",
            currency: "VND",
          }),
      },
      {
        accessorKey: "description",
        header: "Mô tả",
        cell: (info) => {
          const text = info.getValue<string>();
          return text.length > 50 ? text.slice(0, 50) + "..." : text;
        },
      },
      {
        accessorKey: "category",
        header: "Danh mục",
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: "brand",
        header: "Thương hiệu",
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: "sizes",
        header: "Kích cỡ",
        cell: (info) => info.getValue<string[]>().join(", "),
      },
      {
        accessorKey: "colors",
        header: "Màu sắc",
        cell: (info) => info.getValue<string[]>().join(", "),
      },
      {
        id: "actions",
        header: "Hành động",
        cell: ({ row }) => {
          const product = row.original;
          return (
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => handleEdit(product._id)}>
                Sửa
              </Button>
              <Button
                variant="destructive"
                onClick={() => handleDelete(product._id)}
              >
                Xóa
              </Button>
            </div>
          );
        },
      },
    ],
    [handleDelete, handleEdit]
  );

  const table = useReactTable({
    data: mappedData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
    },
  });

  return (
    <div className="w-full bg-white rounded-lg shadow-md p-4">
      <div className="flex items-center py-4 justify-between">
        <Input
          placeholder="Tìm kiếm tên sản phẩm..."
          className="max-w-sm"
          value={(table.getColumn("name")?.getFilterValue() as string) || ""}
          onChange={(event) =>
            table.getColumn("name")?.setFilterValue(event.target.value)
          }
        />
        <Button
          variant="outline"
          onClick={() => router.push("/admin/products/create")}
        >
          Thêm sản phẩm
        </Button>
      </div>
      <div className="rounded-md border border-gray-200">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow
                key={headerGroup.id}
                className="bg-gray-50 hover:bg-gray-50"
              >
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="font-semibold text-gray-700"
                    onClick={header.column.getToggleSortingHandler()}
                    style={{ cursor: "pointer" }}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                    {{
                      asc: " 🔼",
                      desc: " 🔽",
                    }[header.column.getIsSorted() as string] ?? null}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} className="hover:bg-gray-50">
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="text-gray-600">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center text-gray-500"
                >
                  Không có sản phẩm nào.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <div className="flex items-center justify-between px-4 py-4">
          <div className="flex-1 text-sm text-gray-500">
            {table.getFilteredRowModel().rows.length} sản phẩm
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              Trang trước
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Trang sau
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
