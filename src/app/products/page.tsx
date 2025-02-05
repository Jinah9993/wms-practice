import ProductTable from "@/components/ProductTable";

const mockData = [
  { id: 1, name: "Product A", sku: "SKU001", status: "Available" },
  { id: 2, name: "Product B", sku: "SKU002", status: "Out of Stock" },
  { id: 3, name: "Product C", sku: "SKU003", status: "Available" },
  { id: 4, name: "Product D", sku: "SKU004", status: "Discontinued" },
];

export default function ProductsPage() {
  return (
    <div className="max-w-4xl mx-auto p-6 bg-white">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">📦 Product List</h1>
      <ProductTable data={mockData} />
    </div>
  );
}
