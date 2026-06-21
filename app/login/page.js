"use client"
import Link from "next/link"
import { useState } from "react"
import { supabase } from "../lib/supabase"
import config from "../../config"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isSignUp, setIsSignUp] = useState(false)
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const handleAuth = async () => {
    setLoading(true)
    setMessage("")

    if (isSignUp) {
      const { error } = await supabase.auth.signUp({ email, password })
      if (error) {
        setMessage(error.message)
      } else {
        setMessage("Account created! Please check your email to confirm.")
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) {
        setMessage(error.message)
      } else {
        window.location.href = "/"
      }
    }

    setLoading(false)
  }

  return (
    <main className="px-6 py-10 max-w-md mx-auto">
<h1 style={{ color: "var(--theme-text)" }} className="text-3xl font-bold mb-6">
  {isSignUp ? "Create Account" : "Login"}
</h1>

      <div className="flex flex-col gap-4">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black"
        />
<div className="relative">
  <input
    type={showPassword ? "text" : "password"}
    placeholder="Password"
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
          <p className="text-sm text-red-500">{message}</p>
        )}

<button
  onClick={handleAuth}
  disabled={loading}
  style={{ background: "var(--theme-accent)", color: "var(--theme-accent-text)", borderRadius: "var(--theme-radius)" }}
  className="py-3 hover:opacity-90 transition-opacity disabled:opacity-50"
>
  {loading ? "Please wait..." : isSignUp ? "Sign Up" : "Login"}
</button>

{!isSignUp && (
  <p className="text-right text-sm">
    <Link href="/forgot-password" className="text-gray-500 hover:text-black">
      Forgot password?
    </Link>
  </p>
)}
<p style={{ color: "var(--theme-text)" }} className="text-center text-sm opacity-70">
  {isSignUp ? "Already have an account?" : "Don't have an account?"}
  <button
    onClick={() => setIsSignUp(!isSignUp)}
    style={{ color: "var(--theme-accent)" }}
    className="ml-1 font-semibold hover:underline"
  >
    {isSignUp ? "Login" : "Sign Up"}
  </button>
</p>
      </div>
    </main>
  )
}