"use client"

import Link from "next/link"
import { useCart } from "../context/CartContext"

export default function ProductCard({ product }) {
  const { addToCart } = useCart()

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <Link href={`/products/${product.id}`}>
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-64 object-cover cursor-pointer"
        />
      </Link>
      <div className="p-4">
        <p className="text-sm text-gray-400 mb-1">{product.category}</p>
        <Link href={`/products/${product.id}`}>
          <h2 style={{ color: "var(--theme-text)" }} className="text-lg font-semibold mb-1 hover:underline cursor-pointer">{product.name}</h2>
        </Link>
        <p className="text-gray-500 text-sm mb-3">{product.description}</p>
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