"use client"

import { useState, useEffect } from "react"
import { supabase } from "../../lib/supabase"

export default function GalleryPage() {
  const [images, setImages] = useState([])
  const [uploading, setUploading] = useState(false)
  const [copied, setCopied] = useState("")
  const [message, setMessage] = useState("")

  useEffect(() => {
    fetchImages()
  }, [])

  const fetchImages = async () => {
    const { data, error } = await supabase.storage
      .from("store-images")
      .list("", { sortBy: { column: "created_at", order: "desc" } })

    if (error) {
      console.error("Error fetching images:", error)
    } else {
      setImages(data || [])
    }
  }

  const handleUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    setUploading(true)
    setMessage("")

    const fileName = `${Date.now()}-${file.name}`

    const { error } = await supabase.storage
      .from("store-images")
      .upload(fileName, file)

    if (error) {
      setMessage("Upload failed: " + error.message)
    } else {
      setMessage("Image uploaded successfully!")
      fetchImages()
    }

    setUploading(false)
  }

  const handleDelete = async (fileName) => {
    const { error } = await supabase.storage
      .from("store-images")
      .remove([fileName])

    if (error) {
      setMessage("Delete failed: " + error.message)
    } else {
      setMessage("Image deleted!")
      fetchImages()
    }
  }

  const handleCopy = (fileName) => {
    const { data } = supabase.storage
      .from("store-images")
      .getPublicUrl(fileName)

    navigator.clipboard.writeText(data.publicUrl)
    setCopied(fileName)
    setTimeout(() => setCopied(""), 2000)
  }

  const getPublicUrl = (fileName) => {
    const { data } = supabase.storage
      .from("store-images")
      .getPublicUrl(fileName)
    return data.publicUrl
  }

  return (
    <main className="px-6 py-10 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">Image Gallery</h1>
      <p className="text-gray-500 mb-6">Upload and manage images for your store.</p>

      <div className="mb-8">
        <label className="bg-black text-white px-6 py-3 rounded-lg cursor-pointer hover:bg-gray-800 transition-colors">
          {uploading ? "Uploading..." : "Upload Image"}
          <input
            type="file"
            accept="image/*"
            onChange={handleUpload}
            className="hidden"
            disabled={uploading}
          />
        </label>
      </div>

      {message && (
        <p className="text-sm text-green-600 mb-6">{message}</p>
      )}

      {images.length === 0 ? (
        <p className="text-gray-400">No images uploaded yet.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((image) => (
            <div key={image.name} className="border border-gray-200 rounded-lg overflow-hidden">
              <img
                src={getPublicUrl(image.name)}
                alt={image.name}
                className="w-full h-40 object-cover"
              />
              <div className="p-2 flex flex-col gap-2">
                <p className="text-xs text-gray-500 truncate">{image.name}</p>
                <button
                  onClick={() => handleCopy(image.name)}
                  className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 py-1 rounded transition-colors"
                >
                  {copied === image.name ? "Copied!" : "Copy URL"}
                </button>
                <button
                  onClick={() => handleDelete(image.name)}
                  className="text-xs bg-red-50 hover:bg-red-100 text-red-600 py-1 rounded transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  )
}