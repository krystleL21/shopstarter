import config from "../config"
import { supabase } from "./lib/supabase"
import ProductCard from "./components/ProductCard"

export default async function Home() {
  const { data: products, error } = await supabase
    .from("products")
    .select("*")

  if (error) {
    console.error("Error fetching products:", error)
    return <p className="p-10 text-gray-500">Failed to load products.</p>
  }

  return (
    <main>
      {/* Hero Section */}
      <section style={{ background: "var(--theme-hero-bg)", color: "var(--theme-accent-text)" }} className="px-6 py-20 text-center">
       <h1 style={{ color: "var(--theme-hero-text)" }} className="text-4xl font-bold mb-4">{config.heroTitle}</h1>
<p style={{ color: "var(--theme-hero-text)", opacity: 0.7 }} className="text-lg mb-8">{config.heroSubtitle}</p>
        
         <a href="/products"
  style={{ background: "var(--theme-accent)", color: "var(--theme-accent-text)", borderRadius: "var(--theme-radius)" }}
  className="px-8 py-3 font-semibold hover:opacity-90 transition-opacity"
>
  Shop Now
</a>
      </section>

      {/* Product Grid */}
      <section className="px-6 py-10">
        <h2 style={{ color: "var(--theme-text)" }} className="text-2xl font-bold mb-6">Featured Products</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </main>
  )
}