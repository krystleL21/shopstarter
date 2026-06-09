"use client"

import { useState, useEffect } from "react"
import { loadStripe } from "@stripe/stripe-js"
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js"
import { useCart } from "../context/CartContext"
import { supabase } from "../lib/supabase"
import ProtectedRoute from "../components/ProtectedRoute"

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)

function CheckoutForm({ cart, getTotalPrice, userId, setCart }) {
  const stripe = useStripe()
  const elements = useElements()
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!stripe || !elements) return

    setLoading(true)

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/order-confirmation`,
      },
      redirect: "if_required",
    })

    if (error) {
      setMessage(error.message)
      setLoading(false)
    } else if (paymentIntent && paymentIntent.status === "succeeded") {
      await fetch("/api/save-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          paymentIntentId: paymentIntent.id,
          cart,
          total: getTotalPrice(),
          userId,
        }),
      })
      setCart([])
      window.location.href = "/order-confirmation"
    }

    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <PaymentElement />
      {message && <p className="text-red-500 text-sm">{message}</p>}
      <button
        type="submit"
        disabled={!stripe || loading}
        className="bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 mt-4"
      >
        {loading ? "Processing..." : "Pay Now"}
      </button>
    </form>
  )
}

export default function CheckoutPage() {
  const { cart, getTotalPrice, setCart } = useCart()
  const [clientSecret, setClientSecret] = useState("")
  const [userId, setUserId] = useState(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUserId(session?.user?.id ?? null)
    })
  }, [])

  useEffect(() => {
    if (cart.length === 0) return
    if (clientSecret) return

    fetch("/api/create-payment-intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: getTotalPrice() }),
    })
      .then((res) => res.json())
      .then((data) => setClientSecret(data.clientSecret))
  }, [cart])

  return (
    <ProtectedRoute>
      <main className="px-6 py-10 max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Checkout</h1>

        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Order Summary</h2>
          {cart.map((item) => (
            <div key={item.id} className="flex justify-between text-gray-600 mb-2">
              <span>{item.name} x {item.quantity}</span>
              <span>${(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
          <div className="border-t pt-4 mt-4 flex justify-between font-bold text-gray-800">
            <span>Total</span>
            <span>${getTotalPrice()}</span>
          </div>
        </div>

        {clientSecret && (
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-6">Payment Details</h2>
            <Elements stripe={stripePromise} options={{ clientSecret }}>
              <CheckoutForm cart={cart} getTotalPrice={getTotalPrice} userId={userId} setCart={setCart} />
            </Elements>
          </div>
        )}

        {cart.length === 0 && (
          <p className="text-gray-500">Your cart is empty. Add products before checking out!</p>
        )}
      </main>
    </ProtectedRoute>
  )
}