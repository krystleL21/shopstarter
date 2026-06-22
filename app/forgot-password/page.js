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
      <h1 style={{ color: "var(--theme-text)" }} className="text-3xl font-bold mb-2">
        Forgot Password
      </h1>
      <p style={{ color: "var(--theme-text)" }} className="mb-6 opacity-80">
        Enter your email and we'll send you a reset link.
      </p>

      <div className="flex flex-col gap-4">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{
            background: "var(--theme-bg)",
            color: "var(--theme-text)",
            borderColor: "var(--theme-text)",
            borderRadius: "var(--theme-radius)",
          }}
          className="border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--theme-accent)]"
        />

        {message && (
          <p className="text-sm" style={{ color: message.includes("Check your email") ? "var(--theme-text)" : "#ef4444" }}>
            {message}
          </p>
        )}

        <button
          onClick={handleReset}
          disabled={loading}
          style={{
            background: "var(--theme-accent)",
            color: "var(--theme-accent-text)",
            borderRadius: "var(--theme-radius)",
          }}
          className="py-3 hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {loading ? "Sending..." : "Send Reset Link"}
        </button>

        <p style={{ color: "var(--theme-text)" }} className="text-center text-sm opacity-80">
          Remember your password?{" "}
          <Link href="/login" style={{ color: "var(--theme-accent)" }} className="font-semibold hover:underline">
            Login
          </Link>
        </p>
      </div>
    </main>
  )
}