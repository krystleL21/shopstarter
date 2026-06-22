"use client"

import { useEffect, useState } from "react"
import { useCart } from "../../context/CartContext"
import { supabase } from "../../lib/supabase"
import Link from "next/link"
import { use } from "react"
import useCurrentTheme from "../../hooks/useCurrentTheme"
import { getThemeProductImage } from "../../data/themeProductImages"

export default function ProductPage({ params }) {
  const { id } = use(params)
  const { addToCart } = useCart()
  const [product, setProduct] = useState(null)
  const [error, setError] = useState(null)
  const theme = useCurrentTheme()

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
    return <p style={{ color: "var(--theme-text)" }} className="p-10 opacity-80">Product not found.</p>
  }

  if (!product) {
    return <p style={{ color: "var(--theme-text)" }} className="p-10 opacity-80">Loading...</p>
  }

  const displayImage = getThemeProductImage(product, theme)

  return (
    <main className="px-6 py-10 max-w-4xl mx-auto">
      {/* Back Button */}
      <Link href="/" style={{ color: "var(--theme-text)" }} className="text-sm mb-6 inline-block opacity-80 hover:opacity-100">
        ← Back to Products
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mt-4">
        {/* Product Image */}
        <img
          src={displayImage}
          alt={product.name}
          style={{ borderRadius: "var(--theme-radius)" }}
          className="w-full h-96 object-cover shadow-md"
        />

        {/* Product Info */}
        <div className="flex flex-col justify-center">
          <p style={{ color: "var(--theme-text)" }} className="text-sm mb-2 opacity-60">{product.category}</p>
          <h1 style={{ color: "var(--theme-text)" }} className="text-3xl font-bold mb-4">{product.name}</h1>
          <p style={{ color: "var(--theme-text)" }} className="mb-6 opacity-80">{product.description}</p>
          <p style={{ color: "var(--theme-text)" }} className="text-2xl font-bold mb-6">${product.price}</p>

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
            style={{
              background: "var(--theme-accent)",
              color: "var(--theme-accent-text)",
              borderRadius: "var(--theme-radius)",
            }}
            className="px-6 py-3 hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
          </button>
        </div>
      </div>
    </main>
  )
}