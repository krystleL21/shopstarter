"use client"

import Link from "next/link"
import { useEffect } from "react"
import { useCart } from "../context/CartContext"
import { supabase } from "../lib/supabase"

export default function OrderConfirmationPage() {
  const { setCart } = useCart()

  useEffect(() => {
    async function clearCart() {
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user) {
        await supabase
          .from("cart")
          .delete()
          .eq("user_id", session.user.id)
      }
      setCart([])
    }
    clearCart()
  }, [])

  return (
    <main className="px-6 py-20 max-w-lg mx-auto text-center">
      <div className="text-6xl mb-6">🎉</div>
      <h1 style={{ color: "var(--theme-text)" }} className="text-3xl font-bold mb-4">
        Order Confirmed!
      </h1>
      <p style={{ color: "var(--theme-text)" }} className="mb-8 opacity-80">
        Thank you for your purchase! Your order has been successfully placed.
      </p>
      <Link
        href="/products"
        style={{
          background: "var(--theme-accent)",
          color: "var(--theme-accent-text)",
          borderRadius: "var(--theme-radius)",
        }}
        className="px-8 py-3 font-semibold hover:opacity-90 transition-opacity"
      >
        Continue Shopping
      </Link>
    </main>
  )
}