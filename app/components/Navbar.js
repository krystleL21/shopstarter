"use client"

import Link from "next/link"
import { useCart } from "../context/CartContext"
import { supabase } from "../lib/supabase"
import { useEffect, useState } from "react"
import config from "../../config"

const themeOptions = [
  { key: "classic", label: "Classic" },
  { key: "streetwear", label: "Streetwear" },
  { key: "harvest", label: "Harvest" },
]

export default function Navbar() {
  const { getTotalItems } = useCart()
  const [user, setUser] = useState(null)
  const [theme, setTheme] = useState(() => {
    if (typeof window === "undefined") {
      return config.theme
    }

    const savedTheme = window.localStorage.getItem("shopstarter-theme")
    return themeOptions.some((option) => option.key === savedTheme) ? savedTheme : config.theme
  })

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme)
    window.localStorage.setItem("shopstarter-theme", theme)
    window.dispatchEvent(new CustomEvent("shopstarter-theme-change", { detail: theme }))
  }, [theme])

const handleLogout = async () => {
    await supabase.auth.signOut()
    window.location.href = "/login"
  }

  return (
    <>
<div style={{ background: "var(--theme-accent)", color: "var(--theme-accent-text)" }} className="text-center text-sm py-2 px-4 font-semibold">
  🛍️ Demo Store — Products are not real. Use test card 4242 4242 4242 4242 for checkout.
</div>
    <nav style={{ background: "var(--theme-bg)" }} className="shadow-md px-6 py-4 flex justify-between items-center">

      <Link href="/" style={{ color: "var(--theme-text)" }} className="text-xl font-bold">{config.storeName}</Link>
      <ul style={{ color: "var(--theme-text)" }} className="flex gap-6 items-center opacity-80">
        <li><Link href="/">Home</Link></li>
        <li><Link href="/products">Products</Link></li>
        <li><Link href="/about">About</Link></li>
        <li>
          <Link href="/cart" className="relative">
            Cart
            {getTotalItems() > 0 && (
              <span style={{ background: "var(--theme-accent)", color: "var(--theme-accent-text)" }} className="ml-1 text-xs rounded-full px-2 py-0.5">
                {getTotalItems()}
              </span>
            )}
          </Link>
        </li>
        {user ? (
  <>
    <li><Link href="/profile" style={{ color: "var(--theme-text)" }} className="text-sm opacity-80 hover:opacity-100">{user.email}</Link></li>
    <li><Link href="/profile" style={{ color: "var(--theme-text)" }} className="hover:opacity-100 opacity-80">My Account</Link></li>
    <li><Link href="/orders" style={{ color: "var(--theme-text)" }} className="hover:opacity-100 opacity-80">My Orders</Link></li>
    {user.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL && (
      <li><Link href="/admin" style={{ color: "var(--theme-accent)" }} className="font-semibold hover:opacity-80">Admin</Link></li>
    )}
    <li>
      <button
        onClick={handleLogout}
        style={{ background: "var(--theme-accent)", color: "var(--theme-accent-text)", borderRadius: "var(--theme-radius)" }}
        className="text-sm px-4 py-2 hover:opacity-90 transition-opacity"
      >
        Logout
      </button>
    </li>
  </>
) : (
  <li><Link href="/login">Login</Link></li>
)}
        <li>
          <label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide">
            <span className="opacity-70">Theme</span>
            <select
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              style={{
                background: "var(--theme-bg)",
                color: "var(--theme-text)",
                borderColor: "var(--theme-text)",
                borderRadius: "var(--theme-radius)",
              }}
              className="border px-2 py-1 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[var(--theme-accent)]"
              aria-label="Select theme"
            >
              {themeOptions.map((option) => (
                <option key={option.key} value={option.key}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        </li>
      </ul>
    </nav>
    </>
  )
}