export default function robots() {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/checkout", "/order-confirmation"],
    },
    sitemap: "https://my-store.vercel.app/sitemap.xml",
  }
}