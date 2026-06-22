"use client"

import { useState, useEffect } from "react"
import { supabase } from "../../lib/supabase"

export default function GalleryPage() {
  const [images, setImages] = useState([])
  const [uploading, setUploading] = useState(false)
  const [copied, setCopied] = useState("")
  const [message, setMessage] = useState("")

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

  useEffect(() => {
    void Promise.resolve().then(fetchImages)
  }, [])

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
      <h1 style={{ color: "var(--theme-text)" }} className="text-3xl font-bold mb-2">
        Image Gallery
      </h1>
      <p style={{ color: "var(--theme-text)" }} className="mb-6 opacity-80">
        Upload and manage images for your store.
      </p>

      <div className="mb-8">
        <label
          style={{
            background: "var(--theme-accent)",
            color: "var(--theme-accent-text)",
            borderRadius: "var(--theme-radius)",
          }}
          className="px-6 py-3 cursor-pointer hover:opacity-90 transition-opacity inline-flex items-center"
        >
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
        <p style={{ color: "var(--theme-text)" }} className="text-sm mb-6 opacity-80">
          {message}
        </p>
      )}

      {images.length === 0 ? (
        <p className="opacity-70">No images uploaded yet.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((image) => (
            <div
              key={image.name}
              style={{
                background: "var(--theme-bg)",
                color: "var(--theme-text)",
                borderColor: "var(--theme-text)",
                borderRadius: "var(--theme-radius)",
              }}
              className="border overflow-hidden shadow-sm"
            >
              <img
                src={getPublicUrl(image.name)}
                alt={image.name}
                className="w-full h-40 object-cover"
              />
              <div className="p-2 flex flex-col gap-2">
                <p style={{ color: "var(--theme-text)" }} className="text-xs truncate opacity-80">
                  {image.name}
                </p>
                <button
                  onClick={() => handleCopy(image.name)}
                  style={{
                    background: "var(--theme-text)",
                    color: "var(--theme-bg)",
                    borderRadius: "var(--theme-radius)",
                  }}
                  className="text-xs py-1 hover:opacity-90 transition-opacity"
                >
                  {copied === image.name ? "Copied!" : "Copy URL"}
                </button>
                <button
                  onClick={() => handleDelete(image.name)}
                  className="text-xs py-1 rounded transition-colors"
                  style={{
                    background: "rgba(193, 87, 44, 0.12)",
                    color: "var(--theme-text)",
                    borderRadius: "var(--theme-radius)",
                  }}
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