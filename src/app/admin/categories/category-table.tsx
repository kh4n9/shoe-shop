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
import { deleteCategory, getCategories } from "@/services/admin/category";
import { useRouter } from "next/navigation";

interface Category {
  _id: string;
  name: string;
  description: string;
}

export default function CategoryTable() {
  const [data, setData] = React.useState<Category[]>([]);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const router = useRouter();

  React.useEffect(() => {
    getCategories().then((categories) => setData(categories));
  }, []);

  const handleDelete = async (id: string) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa danh mục này?")) {
      try {
        const category = data.find((cat) => cat._id === id);
        if (!category) throw new Error("Category not found");
        await deleteCategory(category);
        setData(data.filter((category) => category._id !== id));
      } catch (error) {
        console.error("Error deleting category:", error);
      }
    }
  };

  const handleEdit = React.useCallback(
    (id: string) => {
      router.push(`/admin/categories/edit/${id}`);
    },
    [router]
  );

  const columns = React.useMemo<ColumnDef<Category>[]>(
    () => [
      {
        accessorKey: "name",
        header: "Tên danh mục",
        cell: (info) => info.getValue(),
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
        id: "actions",
        header: "Hành động",
        cell: ({ row }) => {
          const category = row.original;
          return (
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => handleEdit(category._id)}
              >
                Sửa
              </Button>
              <Button
                variant="destructive"
                onClick={() => handleDelete(category._id)}
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
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center py-4">
        <Input
          placeholder="Lọc theo tên..."
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("name")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
      </div>
      <div className="rounded-md border overflow-hidden">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="bg-gray-50">
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      className="font-semibold text-gray-700"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="hover:bg-gray-50 transition-colors"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
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
                  Không có danh mục nào.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
          className="text-gray-700"
        >
          Trước
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
          className="text-gray-700"
        >
          Sau
        </Button>
      </div>
    </div>
  );
}
