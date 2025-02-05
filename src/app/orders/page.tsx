"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Search from "@/components/Search";
import Pagination from "@/components/Pagination";

type Order = {
  id: number;
  orderNumber: string;
  customerName: string;
  status: string;
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [newOrderNumber, setNewOrderNumber] = useState("");
  const [newCustomerName, setNewCustomerName] = useState("");

  const searchParams = useSearchParams();
  const query = searchParams.get("query") || "";
  const currentPage = Number(searchParams.get("page")) || 1;
  const ordersPerPage = 10;

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch("/api/orders");
        const data = await res.json();
        if (data.success) {
          setOrders(data.data);
        }
      } catch (error) {
        console.error("failed to fetch orders", error);
      }
    };

    fetchOrders();
  }, []);

  // filter orders based on query
  useEffect(() => {
    let updatedOrders = orders;
    if (query) {
      updatedOrders = updatedOrders.filter(
        (order) =>
          order.orderNumber.toLowerCase().includes(query.toLowerCase()) ||
          order.customerName.toLowerCase().includes(query.toLowerCase())
      );
    }
    setFilteredOrders(updatedOrders);
  }, [query, orders]);

  // add new order
  const handleAddOrder = async () => {
    if (!newOrderNumber.trim() || !newCustomerName.trim()) return;

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderNumber: newOrderNumber, customerName: newCustomerName, status: "Pending" }),
      });

      const data = await res.json();
      if (data.success) {
        setOrders([...orders, data.newOrder]);
        setNewOrderNumber("");
        setNewCustomerName("");
      }
    } catch (error) {
      console.error("failed to add order", error);
    }
  };

  // delete order
  const handleDeleteOrder = async (id: number) => {
    try {
      const res = await fetch("/api/orders", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      const data = await res.json();
      if (data.success) {
        setOrders(orders.filter((order) => order.id !== id));
      }
    } catch (error) {
      console.error("failed to delete order", error);
    }
  };

  // update order status
  const handleUpdateStatus = async (id: number, newStatus: string) => {
    try {
      const res = await fetch("/api/orders", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus }),
      });

      const data = await res.json();
      if (data.success) {
        setOrders(
          orders.map((order) =>
            order.id === id ? { ...order, status: newStatus } : order
          )
        );
      }
    } catch (error) {
      console.error("failed to update order status", error);
    }
  };

  // calculate pagination
  const startIndex = (currentPage - 1) * ordersPerPage;
  const displayedOrders = filteredOrders.slice(startIndex, startIndex + ordersPerPage);

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">📦 Order List</h1>

      {/* search component */}
      <Search />

      {/* add order form */}
      <div className="mb-6 p-4 border-b">
        <h2 className="text-lg font-semibold mb-3 text-gray-700">➕ Add New Order</h2>
        <input 
          type="text" 
          placeholder="Order Number" 
          value={newOrderNumber} 
          onChange={(e) => setNewOrderNumber(e.target.value)}
          className="border-b p-2 w-full mb-3 text-gray-900 placeholder-gray-600 focus:outline-none focus:border-blue-500"
        />
        <input 
          type="text" 
          placeholder="Customer Name" 
          value={newCustomerName} 
          onChange={(e) => setNewCustomerName(e.target.value)}
          className="border-b p-2 w-full mb-3 text-gray-900 placeholder-gray-600 focus:outline-none focus:border-blue-500"
        />
        <button 
          onClick={handleAddOrder} 
          className="bg-blue-500 text-white px-4 py-2 hover:bg-blue-600 w-full transition-all"
        >
          Add Order
        </button>
      </div>

      {/* order list */}
      <ul>
        {displayedOrders.length > 0 ? (
          displayedOrders.map((order) => (
            <li key={order.id} className="p-4 border-b flex justify-between items-center">
              <div>
                <Link href={`/orders/${order.id}`} className="text-blue-600 font-semibold hover:underline">
                  {order.orderNumber} - {order.customerName}
                </Link>
                <p className="text-sm text-gray-500">
                  status: 
                  <select 
                    onChange={(e) => handleUpdateStatus(order.id, e.target.value)}
                    value={order.status}
                    className="ml-2 border-b bg-transparent text-gray-800 focus:outline-none"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                  </select>
                </p>
              </div>
              <button 
                onClick={() => handleDeleteOrder(order.id)}
                className="text-red-500 hover:text-red-600 transition-all"
              >
                🗑 Delete
              </button>
            </li>
          ))
        ) : (
          <p className="text-gray-500 text-center mt-4">No orders found.</p>
        )}
      </ul>

      {/* pagination component */}
      <Pagination totalOrders={filteredOrders.length} ordersPerPage={ordersPerPage} />
    </div>
  );
}
