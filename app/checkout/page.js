"use client"

import { useState, useEffect } from "react"
import { loadStripe } from "@stripe/stripe-js"
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js"
import { useCart } from "../context/CartContext"
import { supabase } from "../lib/supabase"
import ProtectedRoute from "../components/ProtectedRoute"
import config from "../../config"

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
  style={{ background: "var(--theme-accent)", color: "var(--theme-accent-text)", borderRadius: "var(--theme-radius)" }}
  className="py-3 hover:opacity-90 transition-opacity disabled:opacity-50 mt-4"
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
        <h1 style={{ color: "var(--theme-text)" }} className="text-3xl font-bold mb-8">Checkout</h1>

        <div style={{ background: "var(--theme-bg)" }} className="rounded-xl shadow-md p-6 mb-8 border">
  <h2 style={{ color: "var(--theme-text)" }} className="text-xl font-bold mb-4">Order Summary</h2>
  {cart.map((item) => (
    <div key={item.id} style={{ color: "var(--theme-text)" }} className="flex justify-between mb-2 opacity-70">
      <span>{item.name} x {item.quantity}</span>
      <span>${(item.price * item.quantity).toFixed(2)}</span>
    </div>
  ))}
  <div style={{ borderColor: "var(--theme-text)", color: "var(--theme-text)" }} className="border-t pt-4 mt-4 flex justify-between font-bold">
    <span>Total</span>
    <span>${getTotalPrice()}</span>
  </div>
</div>

        {clientSecret && (
          <div style={{ background: "var(--theme-bg)" }} className="rounded-xl shadow-md p-6 border">
  <h2 style={{ color: "var(--theme-text)" }} className="text-xl font-bold mb-6">Payment Details</h2>
  <Elements stripe={stripePromise} options={{ clientSecret }}>
    <CheckoutForm cart={cart} getTotalPrice={getTotalPrice} userId={userId} setCart={setCart} />
  </Elements>
</div>
        )}

        {cart.length === 0 && (
          <p style={{ color: "var(--theme-text)" }} className="opacity-80">Your cart is empty. Add products before checking out!</p>
        )}
      </main>
    </ProtectedRoute>
  )
}