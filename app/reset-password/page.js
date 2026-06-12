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
      <h1 className="text-3xl font-bold text-gray-800 mb-2">Reset Password</h1>
      <p className="text-gray-500 mb-6">Enter your new password below.</p>

      <div className="flex flex-col gap-4">
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="New Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black w-full"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-2.5 text-gray-500 hover:text-black"
          >
            {showPassword ? "🙈" : "👁️"}
          </button>
        </div>

        {message && (
          <p className="text-sm text-green-600">{message}</p>
        )}

        <button
          onClick={handleUpdatePassword}
          disabled={loading}
          className="bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50"
        >
          {loading ? "Updating..." : "Update Password"}
        </button>
      </div>
    </main>
  )
}