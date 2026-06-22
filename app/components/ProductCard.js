"use client"

import Link from "next/link"
import { useCart } from "../context/CartContext"
import useCurrentTheme from "../hooks/useCurrentTheme"
import { getThemeProductImage } from "../data/themeProductImages"

export default function ProductCard({ product }) {
  const { addToCart } = useCart()
  const theme = useCurrentTheme()
  const displayImage = getThemeProductImage(product, theme)

  return (
    <div style={{ background: "var(--theme-bg)", color: "var(--theme-text)", borderRadius: "var(--theme-radius)" }} className="shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 border">
      <Link href={`/products/${product.id}`}>
        <img
          src={displayImage}
          alt={product.name}
          className="w-full h-64 object-cover cursor-pointer"
        />
      </Link>
      <div className="p-4">
        <p style={{ color: "var(--theme-text)" }} className="text-sm mb-1 opacity-60">{product.category}</p>
        <Link href={`/products/${product.id}`}>
          <h2 style={{ color: "var(--theme-text)" }} className="text-lg font-semibold mb-1 hover:underline cursor-pointer">{product.name}</h2>
        </Link>
        <p style={{ color: "var(--theme-text)" }} className="text-sm mb-3 opacity-80">{product.description}</p>
        <div className="flex justify-between items-center">
          <span style={{ color: "var(--theme-text)" }} className="text-xl font-bold">${product.price}</span>
          <button
              onClick={() => addToCart(product)}
  style={{ background: "var(--theme-accent)", color: "var(--theme-accent-text)", borderRadius: "var(--theme-radius)" }}
  className="text-sm px-4 py-2 hover:opacity-90 transition-opacity"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  )
}