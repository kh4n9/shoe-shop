import type { Metadata } from "next";
import HeaderComponent from "@/components/Header";

export const metadata: Metadata = {
  title: "Shoe Shop",
  description: "Shoe Shop",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={"antialiased bg-gray-300"}>
        <HeaderComponent />
        {children}
      </body>
    </html>
  );
}
