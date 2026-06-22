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
        <h1 style={{ color: "var(--theme-text)" }} className="text-3xl font-bold mb-6">
          My Account
        </h1>
        {user && (
          <div
            style={{
              background: "var(--theme-bg)",
              color: "var(--theme-text)",
              borderRadius: "var(--theme-radius)",
              borderColor: "var(--theme-text)",
            }}
            className="shadow-md p-6 flex flex-col gap-4 border"
          >
            <div>
              <p style={{ color: "var(--theme-text)" }} className="text-sm opacity-60">
                Email
              </p>
              <p style={{ color: "var(--theme-text)" }} className="font-semibold">
                {user.email}
              </p>
            </div>
            <div>
              <p style={{ color: "var(--theme-text)" }} className="text-sm opacity-60">
                Account Created
              </p>
              <p style={{ color: "var(--theme-text)" }} className="font-semibold">
                {new Date(user.created_at).toLocaleDateString()}
              </p>
            </div>
            <div>
              <p style={{ color: "var(--theme-text)" }} className="text-sm opacity-60">
                User ID
              </p>
              <p style={{ color: "var(--theme-text)" }} className="font-semibold text-sm">
                {user.id}
              </p>
            </div>
            <Link
              href="/orders"
              style={{
                background: "var(--theme-accent)",
                color: "var(--theme-accent-text)",
                borderRadius: "var(--theme-radius)",
              }}
              className="text-center py-3 hover:opacity-90 transition-opacity"
            >
              View Order History
            </Link>
          </div>
        )}
      </main>
    </ProtectedRoute>
  )
}