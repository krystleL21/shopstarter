"use client"

import { useEffect, useState } from "react"
import { supabase } from "../lib/supabase"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function AdminPage() {
  const [user, setUser] = useState(null)
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    async function checkAdmin() {
      const { data: { session } } = await supabase.auth.getSession()

      if (!session || session.user.email !== process.env.NEXT_PUBLIC_ADMIN_EMAIL) {
        router.push("/")
        return
      }

      setUser(session.user)
      fetchProducts()
    }

    checkAdmin()
  }, [])

  const fetchProducts = async () => {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("id", { ascending: true })

    if (!error) setProducts(data)
    setLoading(false)
  }

  const deleteProduct = async (id) => {
    const confirm = window.confirm("Are you sure you want to delete this product?")
    if (!confirm) return

    const { error } = await supabase
      .from("products")
      .delete()
      .eq("id", id)

    if (!error) fetchProducts()
  }

  if (loading) {
    return <p className="p-10 text-gray-500">Loading admin dashboard...</p>
  }

  return (
    <main className="px-6 py-10 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
        <Link
          href="/admin/add-product"
          className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition-colors"
        >
          + Add Product
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-4 text-gray-600 font-semibold">Product</th>
              <th className="px-6 py-4 text-gray-600 font-semibold">Category</th>
              <th className="px-6 py-4 text-gray-600 font-semibold">Price</th>
              <th className="px-6 py-4 text-gray-600 font-semibold">Stock</th>
              <th className="px-6 py-4 text-gray-600 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="border-b hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-12 h-12 object-cover rounded-lg"
                    />
                    <span className="font-semibold text-gray-800">{product.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-gray-600">{product.category}</td>
                <td className="px-6 py-4 text-gray-800 font-semibold">${product.price}</td>
                <td className="px-6 py-4">
  {product.stock === 0 ? (
    <span className="bg-red-100 text-red-600 text-sm px-3 py-1 rounded-full font-semibold">Out of Stock</span>
  ) : product.stock <= 3 ? (
    <span className="bg-orange-100 text-orange-600 text-sm px-3 py-1 rounded-full font-semibold">{product.stock} left</span>
  ) : (
    <span className="bg-green-100 text-green-600 text-sm px-3 py-1 rounded-full font-semibold">{product.stock} in stock</span>
  )}
</td>

<td className="px-6 py-4">
                  <div className="flex gap-3">
                    <Link
                      href={`/admin/edit-product/${product.id}`}
                      className="text-blue-500 hover:text-blue-700 font-semibold text-sm"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => deleteProduct(product.id)}
                      className="text-red-500 hover:text-red-700 font-semibold text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  )
}