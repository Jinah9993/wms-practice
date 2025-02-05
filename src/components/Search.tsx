"use client";

import { useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import debounce from "lodash.debounce";

export default function Search() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const initialQuery = searchParams.get("query") || "";
  const [query, setQuery] = useState(initialQuery);

  // debounce function to update query
  const updateQuery = useCallback(
    debounce((searchTerm: string) => {
      router.push(`/orders?query=${searchTerm}`);
      setQuery(searchTerm);
    }, 500),
    [router]
  );

  // handle input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    updateQuery(value);
  };

  return (
    <div className="mb-6">
      <input
        type="text"
        placeholder="Search by Order Number or Customer Name..."
        defaultValue={query}
        onChange={handleSearchChange}
        className="border-b p-2 w-full text-gray-900 placeholder-gray-600 focus:outline-none focus:border-blue-500"
      />
    </div>
  );
}
