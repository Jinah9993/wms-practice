"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

type Order = {
  id: number;
  orderNumber: string;
  customerName: string;
  status: string;
};

type Note = {
  id: number;
  content: string;
};

export default function OrderDetailPage() {
  const { id } = useParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [notes, setNotes] = useState<Note[]>([]);
  const [newNote, setNewNote] = useState("");

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const res = await fetch(`/api/orders/${id}`);
        const data = await res.json();
        if (data.success) {
          setOrder(data.order);
          setNotes(data.notes);
        }
      } catch (error) {
        console.error("Failed to fetch order details", error);
      }
    };

    fetchOrderDetails();
  }, [id]);

  const handleAddNote = async () => {
    if (!newNote.trim()) return;

    try {
      const res = await fetch("/api/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId: id, content: newNote }),
      });

      const data = await res.json();
      if (data.success) {
        setNotes([...notes, data.newNote]);
        setNewNote("");
      }
    } catch (error) {
      console.error("Failed to add note", error);
    }
  };

  if (!order) return <p className="text-center mt-10 text-gray-500">Loading...</p>;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white">
      <h1 className="text-3xl font-bold text-gray-800">{order.orderNumber}</h1>
      <p className="text-lg text-gray-600">{order.customerName}</p>
      <p className="text-sm text-blue-500">{order.status}</p>

      <h2 className="mt-6 text-lg font-semibold text-gray-700">📝 Notes</h2>
      <ul className="border-b mt-2">
        {notes.length > 0 ? (
          notes.map((note) => (
            <li key={note.id} className="p-2 border-b last:border-none text-gray-900">
              {note.content}
            </li>
          ))
        ) : (
          <p className="text-gray-500">No notes available.</p>
        )}
      </ul>

      {/* add note */}
      <div className="mt-4">
        <input
          type="text"
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          placeholder="Add a note..."
          className="border-b p-2 w-full text-gray-900 placeholder-gray-600 focus:outline-none focus:border-blue-500"
        />
        <button
          onClick={handleAddNote}
          className="mt-2 bg-blue-500 text-white px-4 py-2 hover:bg-blue-600 transition-all w-full"
        >
          Add Note
        </button>
      </div>
    </div>
  );
}
