"use client"

import { useState } from "react"
import { supabase } from "../lib/supabase"
import Link from "next/link"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)

  const handleReset = async () => {
    setLoading(true)
    setMessage("")

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })

    if (error) {
      setMessage(error.message)
    } else {
      setMessage("Check your email for a password reset link!")
    }

    setLoading(false)
  }

  return (
    <main className="px-6 py-10 max-w-md mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">Forgot Password</h1>
      <p className="text-gray-500 mb-6">Enter your email and we'll send you a reset link.</p>

      <div className="flex flex-col gap-4">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black"
        />

        {message && (
          <p className="text-sm text-green-600">{message}</p>
        )}

        <button
          onClick={handleReset}
          disabled={loading}
          className="bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50"
        >
          {loading ? "Sending..." : "Send Reset Link"}
        </button>

        <p className="text-center text-gray-500 text-sm">
          Remember your password?{" "}
          <Link href="/login" className="text-black font-semibold hover:underline">
            Login
          </Link>
        </p>
      </div>
    </main>
  )
}