"use client"

import { useState } from "react"
import { supabase } from "../lib/supabase"
import { useRouter } from "next/navigation"

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleUpdatePassword = async () => {
    setLoading(true)
    setMessage("")

    const { error } = await supabase.auth.updateUser({ password })

    if (error) {
      setMessage(error.message)
    } else {
      setMessage("Password updated successfully! Redirecting to login...")
      setTimeout(() => router.push("/login"), 2000)
    }

    setLoading(false)
  }

  return (
    <main className="px-6 py-10 max-w-md mx-auto">
      <h1 style={{ color: "var(--theme-text)" }} className="text-3xl font-bold mb-2">
        Reset Password
      </h1>
      <p style={{ color: "var(--theme-text)" }} className="mb-6 opacity-80">
        Enter your new password below.
      </p>

      <div className="flex flex-col gap-4">
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="New Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              background: "var(--theme-bg)",
              color: "var(--theme-text)",
              borderColor: "var(--theme-text)",
              borderRadius: "var(--theme-radius)",
            }}
            className="border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--theme-accent)] w-full"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            style={{ color: "var(--theme-text)" }}
            className="absolute right-3 top-2.5 hover:opacity-70"
          >
            {showPassword ? "🙈" : "👁️"}
          </button>
        </div>

        {message && (
          <p className="text-sm" style={{ color: message.includes("successfully") ? "var(--theme-text)" : "#ef4444" }}>
            {message}
          </p>
        )}

        <button
          onClick={handleUpdatePassword}
          disabled={loading}
          style={{
            background: "var(--theme-accent)",
            color: "var(--theme-accent-text)",
            borderRadius: "var(--theme-radius)",
          }}
          className="py-3 hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {loading ? "Updating..." : "Update Password"}
        </button>
      </div>
    </main>
  )
}