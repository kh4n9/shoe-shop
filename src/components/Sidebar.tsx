import { Calendar, Home, Inbox, Settings, ShoppingBag } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";
import Image from "next/image";
// Menu items.
const items = [
  {
    title: "Bảng điều khiển",
    url: "/admin",
    icon: Home,
  },
  {
    title: "Sản phẩm",
    url: "/admin/products",
    icon: Inbox,
  },
  {
    title: "Danh mục",
    url: "/admin/categories",
    icon: Calendar,
  },
  {
    title: "Thương hiệu",
    url: "/admin/brands",
    icon: Calendar,
  },
  {
    title: "Đơn hàng",
    url: "/admin/orders",
    icon: ShoppingBag,
  },
  {
    title: "Người dùng",
    url: "/admin/users",
    icon: Settings,
  },
];

export default function AppSidebar() {
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarHeader className="flex flex-row items-center gap-2">
          <Image
            src="https://flowbite.com/docs/images/logo.svg"
            alt="logo"
            width={32}
            height={32}
          />
          <span className="self-center text-2xl font-semibold whitespace-nowrap">
            Admin
          </span>
        </SidebarHeader>
        <SidebarGroup>
          <SidebarGroupLabel>Quản lý</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
