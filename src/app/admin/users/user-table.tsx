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
import { getUsers, deleteUser } from "@/services/admin/user";
import { useRouter } from "next/navigation";

interface User {
  _id: string;
  name: string;
  email: string;
  role: "admin" | "user";
  createdAt: string;
  password?: string;
}

export default function UserTable() {
  const [data, setData] = React.useState<User[]>([]);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const router = useRouter();

  React.useEffect(() => {
    getUsers().then((users) => setData(users));
  }, []);

  const handleDelete = React.useCallback(async (id: string) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa người dùng này?")) {
      try {
        await deleteUser(id);
        setData((prev) => prev.filter((user) => user._id !== id));
      } catch (error) {
        console.error("Error deleting user:", error);
        alert("Không thể xóa người dùng này vì họ có đơn hàng hoặc giỏ hàng.");
      }
    }
  }, []);

  const columns = React.useMemo<ColumnDef<User>[]>(
    () => [
      {
        accessorKey: "_id",
        header: "ID",
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: "name",
        header: "Tên",
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: "email",
        header: "Email",
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: "role",
        header: "Vai trò",
        cell: (info) => {
          const role = info.getValue<string>();
          return role === "admin" ? "Quản trị viên" : "Người dùng";
        },
      },
      {
        accessorKey: "createdAt",
        header: "Ngày tạo",
        cell: (info) => {
          const date = new Date(info.getValue<string>());
          return date.toLocaleDateString("vi-VN", {
            year: "numeric",
            month: "long",
            day: "numeric",
          });
        },
      },
      {
        id: "actions",
        header: "Hành động",
        cell: ({ row }) => {
          const user = row.original;
          return (
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => router.push(`/admin/users/${user._id}`)}
              >
                Chi tiết
              </Button>
              <Button
                variant="destructive"
                onClick={() => handleDelete(user._id)}
              >
                Xóa
              </Button>
            </div>
          );
        },
      },
    ],
    [handleDelete, router]
  );

  const table = useReactTable({
    data,
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
          placeholder="Tìm kiếm người dùng..."
          className="max-w-sm"
          value={(table.getColumn("name")?.getFilterValue() as string) || ""}
          onChange={(event) =>
            table.getColumn("name")?.setFilterValue(event.target.value)
          }
        />
        <Button
          variant="outline"
          onClick={() => router.push("/admin/users/create")}
        >
          Thêm người dùng
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
                  Không có người dùng nào.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <div className="flex items-center justify-between px-4 py-4">
          <div className="flex-1 text-sm text-gray-500">
            {table.getFilteredRowModel().rows.length} người dùng
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
