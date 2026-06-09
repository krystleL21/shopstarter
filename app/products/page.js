import { supabase } from "../lib/supabase"
import ProductFilter from "../components/ProductFilter"

export const metadata = {
  title: "All Products",
  description: "Browse our full collection of fashion, accessories, shoes and more.",
}

export default async function ProductsPage() {
  const { data: products, error } = await supabase
    .from("products")
    .select("*")

  if (error) {
    console.error("Error fetching products:", error)
    return <p className="p-10 text-gray-500">Failed to load products.</p>
  }

  return (
    <main className="px-6 py-10">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">All Products</h1>
      <ProductFilter products={products} />
    </main>
  )
}