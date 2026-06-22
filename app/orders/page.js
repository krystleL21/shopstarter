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
        <h1 style={{ color: "var(--theme-text)" }} className="text-3xl font-bold mb-8">
          Order History
        </h1>

        {loading && (
          <p style={{ color: "var(--theme-text)" }} className="opacity-80">
            Loading your orders...
          </p>
        )}

        {!loading && orders.length === 0 && (
          <div className="text-center py-10">
            <p style={{ color: "var(--theme-text)" }} className="mb-4 opacity-80">
              You haven&apos;t placed any orders yet!
            </p>
            <Link
              href="/products"
              style={{
                background: "var(--theme-accent)",
                color: "var(--theme-accent-text)",
                borderRadius: "var(--theme-radius)",
              }}
              className="px-6 py-3 hover:opacity-90 transition-opacity"
            >
              Start Shopping
            </Link>
          </div>
        )}

        <div className="flex flex-col gap-6">
          {orders.map((order) => (
            <div
              key={order.id}
              style={{
                background: "var(--theme-bg)",
                color: "var(--theme-text)",
                borderRadius: "var(--theme-radius)",
                borderColor: "var(--theme-text)",
              }}
              className="shadow-md p-6 border"
            >
              <div className="flex justify-between items-center mb-4">
                <div>
                  <p style={{ color: "var(--theme-text)" }} className="text-sm opacity-60">
                    Order placed
                  </p>
                  <p style={{ color: "var(--theme-text)" }} className="font-semibold">
                    {new Date(order.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <p style={{ color: "var(--theme-text)" }} className="text-sm opacity-60">
                    Total
                  </p>
                  <p style={{ color: "var(--theme-text)" }} className="font-bold">
                    ${order.total}
                  </p>
                </div>
                <div>
                  <span className="bg-green-100 text-green-700 text-sm px-3 py-1 rounded-full font-semibold">
                    {order.status}
                  </span>
                </div>
              </div>

              <div className="border-t pt-4">
                <p style={{ color: "var(--theme-text)" }} className="text-sm mb-2 opacity-60">
                  Items ordered
                </p>
                {order.items.map((item, index) => (
                  <div key={index} style={{ color: "var(--theme-text)" }} className="flex justify-between text-sm mb-1 opacity-80">
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