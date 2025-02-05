"use client";

import { useRouter, useSearchParams } from "next/navigation";

type PaginationProps = {
  totalOrders: number;
  ordersPerPage: number;
};

export default function Pagination({ totalOrders, ordersPerPage }: PaginationProps) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const currentPage = Number(searchParams.get("page")) || 1;
  const totalPages = Math.ceil(totalOrders / ordersPerPage);

  // handle page change
  const changePage = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    router.push(`/orders?page=${newPage}`);
  };

  return (
    <div className="flex justify-center mt-4 space-x-4">
      <button
        onClick={() => changePage(currentPage - 1)}
        disabled={currentPage === 1}
        className={`px-4 py-2 ${currentPage === 1 ? "text-gray-400 cursor-not-allowed" : "text-blue-500 hover:underline"}`}
      >
        ⬅ Previous
      </button>
      <span className="text-gray-700">Page {currentPage} of {totalPages}</span>
      <button
        onClick={() => changePage(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`px-4 py-2 ${currentPage === totalPages ? "text-gray-400 cursor-not-allowed" : "text-blue-500 hover:underline"}`}
      >
        Next ➡
      </button>
    </div>
  );
}
