"use client"

import { useEffect, useState } from "react"
import { supabase } from "../lib/supabase"
import ProtectedRoute from "../components/ProtectedRoute"
import Link from "next/link"

export default function OrdersPage() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchOrders() {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return

      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .eq("user_id", session.user.id)
        .order("created_at", { ascending: false })

      if (!error) setOrders(data)
      setLoading(false)
    }

    fetchOrders()
  }, [])

  return (
    <ProtectedRoute>
      <main className="px-6 py-10 max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Order History</h1>

        {loading && <p className="text-gray-500">Loading your orders...</p>}

        {!loading && orders.length === 0 && (
          <div className="text-center py-10">
            <p className="text-gray-500 mb-4">You haven't placed any orders yet!</p>
            <Link
              href="/products"
              className="bg-black text-white px-6 py-3 rounded-full hover:bg-gray-800 transition-colors"
            >
              Start Shopping
            </Link>
          </div>
        )}

        <div className="flex flex-col gap-6">
          {orders.map((order) => (
            <div key={order.id} className="bg-white rounded-xl shadow-md p-6">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <p className="text-sm text-gray-400">Order placed</p>
                  <p className="text-gray-800 font-semibold">
                    {new Date(order.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-400">Total</p>
                  <p className="text-gray-800 font-bold">${order.total}</p>
                </div>
                <div>
                  <span className="bg-green-100 text-green-700 text-sm px-3 py-1 rounded-full font-semibold">
                    {order.status}
                  </span>
                </div>
              </div>

              <div className="border-t pt-4">
                <p className="text-sm text-gray-400 mb-2">Items ordered</p>
                {order.items.map((item, index) => (
                  <div key={index} className="flex justify-between text-gray-600 text-sm mb-1">
                    <span>{item.name} x {item.quantity}</span>
                    <span>${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </main>
    </ProtectedRoute>
  )
}