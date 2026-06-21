"use client"

import { useCart } from "../context/CartContext"
import ProtectedRoute from "../components/ProtectedRoute"
import config from "../../config"

export default function CartPage() {
  const { cart, removeFromCart, getTotalPrice } = useCart()

  return (
    <ProtectedRoute>
      <main className="px-6 py-10 max-w-3xl mx-auto">
        <h1 style={{ color: "var(--theme-text)" }} className="text-3xl font-bold mb-8">Your Cart</h1>

        {cart.length === 0 ? (
          <p className="text-gray-500">Your cart is empty. Start shopping!</p>
        ) : (
          <>
            <div className="flex flex-col gap-6">
              {cart.map((item) => (
                <div key={item.id} style={{ background: "var(--theme-bg)" }} className="flex items-center gap-4 rounded-xl shadow-md p-4 border" >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-24 h-24 object-cover rounded-lg"
                  />
                  <div className="flex-1">
<h2 style={{ color: "var(--theme-text)" }} className="text-lg font-semibold">{item.name}</h2>
<p style={{ color: "var(--theme-text)" }} className="text-sm opacity-60">${item.price} x {item.quantity}</p>
<p style={{ color: "var(--theme-text)" }} className="font-bold">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-red-500 hover:text-red-700 text-sm font-semibold"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>

            {/* Total */}
            <div style={{ borderColor: "var(--theme-text)" }} className="mt-8 border-t pt-6 flex justify-between items-center opacity-90">
  <p style={{ color: "var(--theme-text)" }} className="text-xl font-bold">Total</p>
  <p style={{ color: "var(--theme-text)" }} className="text-xl font-bold">${getTotalPrice()}</p>
</div>

{/* Checkout Button */}
<a href="/checkout"
  style={{ background: "var(--theme-accent)", color: "var(--theme-accent-text)", borderRadius: "var(--theme-radius)" }}
  className="mt-6 block w-full py-3 hover:opacity-90 transition-opacity text-center"
>
  Proceed to Checkout
</a>
          </>
        )}
      </main>
    </ProtectedRoute>
  )
}