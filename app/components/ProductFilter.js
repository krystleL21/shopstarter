"use client"

import { useState } from "react"
import ProductCard from "./ProductCard"

export default function ProductFilter({ products }) {
  const [search, setSearch] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")

  const categories = ["All", ...new Set(products.map((p) => p.category.trim()))]

  const filtered = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase())
    const matchesCategory = selectedCategory === "All" || p.category.trim() === selectedCategory.trim()
    return matchesSearch && matchesCategory

  })

  return (
    <div>
      {/* Search and Filter Controls */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        {/* Search Bar */}
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            background: "var(--theme-bg)",
            color: "var(--theme-text)",
            borderColor: "var(--theme-text)",
            borderRadius: "var(--theme-radius)",
          }}
          className="border px-4 py-2 w-full sm:w-1/2 focus:outline-none focus:ring-2 focus:ring-[var(--theme-accent)]"
        />

        {/* Category Filter */}
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          style={{
            background: "var(--theme-bg)",
            color: "var(--theme-text)",
            borderColor: "var(--theme-text)",
            borderRadius: "var(--theme-radius)",
          }}
          className="border px-4 py-2 w-full sm:w-1/4 focus:outline-none focus:ring-2 focus:ring-[var(--theme-accent)]"
        >
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      {/* Results */}
      {filtered.length === 0 ? (
        <p style={{ color: "var(--theme-text)" }} className="opacity-80">
          No products found.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  )
}