"use client";

import * as React from "react";
import UserTable from "./user-table";

export default function UsersPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Quản lý người dùng</h1>
      <UserTable />
    </div>
  );
}
