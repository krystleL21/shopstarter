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
      <h1 className="text-3xl font-bold text-gray-800 mb-4">Order Confirmed!</h1>
      <p className="text-gray-500 mb-8">Thank you for your purchase! Your order has been successfully placed.</p>
      <Link
        href="/products"
        className="bg-black text-white px-8 py-3 rounded-full font-semibold hover:bg-gray-800 transition-colors"
      >
        Continue Shopping
      </Link>
    </main>
  )
}