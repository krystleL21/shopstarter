import config from "../../config"

export default function AboutPage() {
  return (
    <main className="px-6 py-16 max-w-3xl mx-auto">
      <h1 style={{ color: "var(--theme-text)" }} className="text-4xl font-bold mb-6">
        {config.aboutTitle}
      </h1>

      {config.aboutImage && (
        <img
          src={config.aboutImage}
          alt={config.aboutTitle}
          style={{ borderRadius: "var(--theme-radius)" }}
          className="w-full h-72 object-cover mb-8"
        />
      )}

      <p style={{ color: "var(--theme-text)" }} className="text-lg leading-relaxed whitespace-pre-line opacity-80">
        {config.aboutContent}
      </p>
    </main>
  )
}