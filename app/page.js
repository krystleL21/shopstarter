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
      <section className="bg-black text-white px-6 py-20 text-center">
       <h1 className="text-4xl font-bold mb-4">{config.heroTitle}</h1>
<p className="text-gray-400 text-lg mb-8">{config.heroSubtitle}</p>
        
         <a href="/products"
          className="bg-white text-black px-8 py-3 rounded-full font-semibold hover:bg-gray-200 transition-colors"
        >
          Shop Now
        </a>
      </section>

      {/* Product Grid */}
      <section className="px-6 py-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Featured Products</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </main>
  )
}