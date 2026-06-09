"use client"

import { useEffect, useState } from "react"
import { useCart } from "../../context/CartContext"
import { supabase } from "../../lib/supabase"
import Link from "next/link"
import { use } from "react"

export default function ProductPage({ params }) {
  const { id } = use(params)
  const { addToCart } = useCart()
  const [product, setProduct] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchProduct() {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", id)
        .single()

      if (error) {
        setError(error)
      } else {
        setProduct(data)
      }
    }

    fetchProduct()
  }, [id])

  if (error) {
    return <p className="p-10 text-gray-500">Product not found.</p>
  }

  if (!product) {
    return <p className="p-10 text-gray-500">Loading...</p>
  }

  return (
    <main className="px-6 py-10 max-w-4xl mx-auto">
      {/* Back Button */}
      <Link href="/" className="text-gray-500 hover:text-black text-sm mb-6 inline-block">
        ← Back to Products
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mt-4">
        {/* Product Image */}
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-96 object-cover rounded-xl shadow-md"
        />

        {/* Product Info */}
        <div className="flex flex-col justify-center">
          <p className="text-sm text-gray-400 mb-2">{product.category}</p>
          <h1 className="text-3xl font-bold text-gray-800 mb-4">{product.name}</h1>
          <p className="text-gray-500 mb-6">{product.description}</p>
          <p className="text-2xl font-bold text-gray-900 mb-6">${product.price}</p>

          {/* Stock Status */}
          {product.stock === 0 ? (
            <p className="text-red-500 font-semibold mb-4">Out of Stock</p>
          ) : product.stock <= 3 ? (
            <p className="text-orange-500 font-semibold mb-4">Only {product.stock} left in stock!</p>
          ) : (
            <p className="text-green-600 font-semibold mb-4">In Stock ({product.stock} available)</p>
          )}

          <button
            onClick={() => addToCart(product)}
            disabled={product.stock === 0}
            className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
          </button>
        </div>
      </div>
    </main>
  )
}