import type { Metadata } from "next";
import Header from "@/components/Header";
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
        <Header />
        {children}
      </body>
    </html>
  );
}
