import config from "../../config"

export default function Footer() {
  return (
 <footer style={{ background: "var(--theme-hero-bg)", color: "var(--theme-text)" }} className="text-center py-6 mt-10 opacity-80">
  <p>© 2026 {config.storeName}. All rights reserved.</p>
</footer>
  )
}