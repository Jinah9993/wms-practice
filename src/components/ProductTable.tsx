"use client";

import { useState } from "react";
import { useReactTable, getCoreRowModel, getSortedRowModel, ColumnDef, flexRender, SortingState } from "@tanstack/react-table";
import SortHeader from "@/components/SortHeader";

type Product = {
  id: number;
  name: string;
  sku: string;
  status: string;
};

const columns: ColumnDef<Product>[] = [
  {
    accessorKey: "id",
    header: ({ column }) => <SortHeader column={column} label="ID" />,
  },
  {
    accessorKey: "name",
    header: ({ column }) => <SortHeader column={column} label="Name" />,
  },
  {
    accessorKey: "sku",
    header: ({ column }) => <SortHeader column={column} label="SKU" />,
  },
  {
    accessorKey: "status",
    header: ({ column }) => <SortHeader column={column} label="Status" />,
  },
];

export default function ProductTable({ data }: { data: Product[] }) {
  const [sorting, setSorting] = useState<SortingState>([]); // ✅ 타입 명시

  const table = useReactTable({
    data,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-900">Product List</h2>
        <button 
          onClick={() => setSorting([])} 
          className="px-4 py-2 text-sm bg-gray-200 hover:bg-gray-300 text-gray-800 rounded"
        >
          Reset Sorting
        </button>
      </div>
      
      <table className="w-full border-collapse border border-gray-300 text-gray-900">
        <thead className="bg-gray-100">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id} className="p-2 border border-gray-300">
                  {flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id} className="hover:bg-gray-50">
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="p-2 border border-gray-300">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
