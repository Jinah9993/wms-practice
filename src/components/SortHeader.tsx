"use client";

import { Column } from "@tanstack/react-table";

export default function SortHeader<TData>({ column, label }: { column: Column<TData, unknown>; label: string }) {
  const isSorted = column.getIsSorted();

  return (
    <button 
      onClick={() => column.toggleSorting()} 
      className="flex items-center gap-1 text-gray-800 hover:text-black"
    >
      {label}
      <span className={isSorted === "asc" ? "text-black" : "text-gray-400"}>▲</span>
      <span className={isSorted === "desc" ? "text-black" : "text-gray-400"}>▼</span>
    </button>
  );
}
