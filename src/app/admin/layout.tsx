import type { Metadata } from "next";
import Sidebar from "@/components/Sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
export const metadata: Metadata = {
  title: "Admin",
  description: "Admin",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={"antialiased bg-gray-300"}>
        <SidebarProvider>
          <Sidebar />
          <div className="flex flex-col w-full">
            <div className="flex-1 p-4">{children}</div>
          </div>
        </SidebarProvider>
      </body>
    </html>
  );
}
