"use client"

import { useState, useEffect } from "react"
import { supabase } from "../../../lib/supabase"
import { useRouter } from "next/navigation"
import { use } from "react"

export default function EditProductPage({ params }) {
  const { id } = use(params)
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [showGallery, setShowGallery] = useState(false)
 const [galleryImages, setGalleryImages] = useState([])
  const [form, setForm] = useState({
    name: "",
    price: "",
    category: "",
    image: "",
    description: "",
  })

  useEffect(() => {
    async function fetchProduct() {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", id)
        .single()

      if (!error) {
        setForm({
          name: data.name,
          price: data.price,
          category: data.category,
          image: data.image,
          description: data.description,
          stock: data.stock,
        })
      }
    }
    fetchProduct()
  }, [id])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const fetchGallery = async () => {
  const { data } = await supabase.storage
    .from("store-images")
    .list("", { sortBy: { column: "created_at", order: "desc" } })
  setGalleryImages(data || [])
  setShowGallery(true)
}

const getPublicUrl = (fileName) => {
  const { data } = supabase.storage
    .from("store-images")
    .getPublicUrl(fileName)
  return data.publicUrl
}

const handleSelectImage = (fileName) => {
  setForm({ ...form, image: getPublicUrl(fileName) })
  setShowGallery(false)
}

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    const { error } = await supabase
      .from("products")
      .update({
        name: form.name,
        price: parseFloat(form.price),
        category: form.category,
        image: form.image,
        description: form.description,
        stock: parseInt(form.stock),
      })
      .eq("id", id)

    if (error) {
      setMessage("Error updating product: " + error.message)
    } else {
      router.push("/admin")
    }

    setLoading(false)
  }

  return (
    <main className="px-6 py-10 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Edit Product</h1>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-md p-6 flex flex-col gap-4">
        <div>
          <label className="text-sm text-gray-500 mb-1 block">Product Name</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>
        <div>
          <label className="text-sm text-gray-500 mb-1 block">Price</label>
          <input
            type="number"
            name="price"
            value={form.price}
            onChange={handleChange}
            required
            step="0.01"
            className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>
        <div>
          <label className="text-sm text-gray-500 mb-1 block">Category</label>
          <input
            type="text"
            name="category"
            value={form.category}
            onChange={handleChange}
            required
            className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>
<div>
  <label className="text-sm text-gray-500 mb-1 block">Image URL</label>
  <div className="flex gap-2">
    <input
      type="text"
      name="image"
      value={form.image}
      onChange={handleChange}
      required
      className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-black"
    />
    <button
      type="button"
      onClick={fetchGallery}
      className="bg-gray-100 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors whitespace-nowrap"
    >
      Choose from Gallery
    </button>
  </div>
  {form.image && (
    <img src={form.image} alt="Preview" className="mt-2 h-20 w-20 object-cover rounded-lg" />
  )}
</div>
            <div>
          <label className="text-sm text-gray-500 mb-1 block">Stock Quantity</label>
          <input
            type="number"
            name="stock"
            value={form.stock}
            onChange={handleChange}
            required
            className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>
        <div>
          <label className="text-sm text-gray-500 mb-1 block">Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            required
            rows={3}
            className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>

        {message && <p className="text-red-500 text-sm">{message}</p>}

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50"
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
          <button
            type="button"
            onClick={() => router.push("/admin")}
            className="bg-gray-100 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>

      {showGallery && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-6 z-50">
          <div className="bg-white rounded-xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">Choose an Image</h2>
              <button
                onClick={() => setShowGallery(false)}
                className="text-gray-500 hover:text-black"
              >
                ✕
              </button>
            </div>

            {galleryImages.length === 0 ? (
              <p className="text-gray-400">No images in the gallery yet. Upload some from the Image Gallery page.</p>
            ) : (
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                {galleryImages.map((image) => (
                  <img
                    key={image.name}
                    src={getPublicUrl(image.name)}
                    alt={image.name}
                    onClick={() => handleSelectImage(image.name)}
                    className="w-full h-24 object-cover rounded-lg cursor-pointer hover:opacity-75 transition-opacity border border-gray-200"
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  )
}
