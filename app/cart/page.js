"use client"

import { useCart } from "../context/CartContext"
import ProtectedRoute from "../components/ProtectedRoute"

export default function CartPage() {
  const { cart, removeFromCart, getTotalPrice } = useCart()

  return (
    <ProtectedRoute>
      <main className="px-6 py-10 max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Your Cart</h1>

        {cart.length === 0 ? (
          <p className="text-gray-500">Your cart is empty. Start shopping!</p>
        ) : (
          <>
            <div className="flex flex-col gap-6">
              {cart.map((item) => (
                <div key={item.id} className="flex items-center gap-4 bg-white rounded-xl shadow-md p-4">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-24 h-24 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h2 className="text-lg font-semibold text-gray-800">{item.name}</h2>
                    <p className="text-gray-500 text-sm">${item.price} x {item.quantity}</p>
                    <p className="text-gray-800 font-bold">${(item.price * item.quantity).toFixed(2)}</p>
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
            <div className="mt-8 border-t pt-6 flex justify-between items-center">
              <p className="text-xl font-bold text-gray-800">Total</p>
              <p className="text-xl font-bold text-gray-900">${getTotalPrice()}</p>
            </div>

            {/* Checkout Button */}
           <a href="/checkout"
  className="mt-6 block w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition-colors text-center"
>
  Proceed to Checkout
</a>
          </>
        )}
      </main>
    </ProtectedRoute>
  )
}