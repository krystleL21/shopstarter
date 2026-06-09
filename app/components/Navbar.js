"use client"

import Link from "next/link"
import { useCart } from "../context/CartContext"
import { supabase } from "../lib/supabase"
import { useEffect, useState } from "react"

export default function Navbar() {
  const { getTotalItems } = useCart()
  const [user, setUser] = useState(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

const handleLogout = async () => {
    await supabase.auth.signOut()
    window.location.href = "/login"
  }

  return (
    <>
<div className="bg-yellow-400 text-black text-center text-sm py-2 px-4 font-semibold">
  🛍️ Demo Store — Products are not real. Use test card 4242 4242 4242 4242 for checkout.
</div>
    <nav className="bg-white shadow-md px-6 py-4 flex justify-between items-center">

      <Link href="/" className="text-xl font-bold text-gray-800">MyStore</Link>
      <ul className="flex gap-6 text-gray-600 items-center">
        <li><Link href="/">Home</Link></li>
        <li><Link href="/products">Products</Link></li>
        <li>
          <Link href="/cart" className="relative">
            Cart
            {getTotalItems() > 0 && (
              <span className="ml-1 bg-black text-white text-xs rounded-full px-2 py-0.5">
                {getTotalItems()}
              </span>
            )}
          </Link>
        </li>
        {user ? (
  <>
    <li><Link href="/profile" className="text-sm text-gray-500 hover:text-black">{user.email}</Link></li>
    <li><Link href="/profile" className="text-gray-600 hover:text-black">My Account</Link></li>
    <li><Link href="/orders" className="text-gray-600 hover:text-black">My Orders</Link></li>
    {user.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL && (
      <li><Link href="/admin" className="text-purple-600 hover:text-purple-800 font-semibold">Admin</Link></li>
    )}
    <li>
      <button
        onClick={handleLogout}
        className="bg-black text-white text-sm px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
      >
        Logout
      </button>
    </li>
  </>
) : (
  <li><Link href="/login">Login</Link></li>
)}
      </ul>
    </nav>
    </>
  )
}