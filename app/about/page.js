import config from "../../config"

export default function AboutPage() {
  return (
    <main className="px-6 py-16 max-w-3xl mx-auto">
      <h1 className="text-4xl font-bold text-gray-800 mb-6">{config.aboutTitle}</h1>

      {config.aboutImage && (
        <img
          src={config.aboutImage}
          alt={config.aboutTitle}
          className="w-full h-72 object-cover rounded-xl mb-8"
        />
      )}

      <p className="text-gray-600 text-lg leading-relaxed whitespace-pre-line">
        {config.aboutContent}
      </p>
    </main>
  )
}