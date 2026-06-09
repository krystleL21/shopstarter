"use client"

import { useEffect, useState } from "react"
import { supabase } from "../lib/supabase"
import ProtectedRoute from "../components/ProtectedRoute"
import Link from "next/link"

export default function ProfilePage() {
  const [user, setUser] = useState(null)

  useEffect(() => {
    async function getUser() {
      const { data: { session } } = await supabase.auth.getSession()
      setUser(session?.user ?? null)
    }
    getUser()
  }, [])

  return (
    <ProtectedRoute>
      <main className="px-6 py-10 max-w-md mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">My Account</h1>
        {user && (
          <div className="bg-white rounded-xl shadow-md p-6 flex flex-col gap-4">
            <div>
              <p className="text-sm text-gray-400">Email</p>
              <p className="text-gray-800 font-semibold">{user.email}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Account Created</p>
              <p className="text-gray-800 font-semibold">
                {new Date(user.created_at).toLocaleDateString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-400">User ID</p>
              <p className="text-gray-800 font-semibold text-sm">{user.id}</p>
            </div>
            <Link
              href="/orders"
              className="bg-black text-white text-center py-3 rounded-lg hover:bg-gray-800 transition-colors"
            >
              View Order History
            </Link>
          </div>
        )}
      </main>
    </ProtectedRoute>
  )
}