import ProductTable from "@/app/admin/products/product-table";

export default function ProductsPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Danh sách sản phẩm</h1>
      <ProductTable />
    </div>
  );
}
