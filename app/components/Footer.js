import config from "../../config"

export default function Footer() {
  return (
    <footer className="bg-gray-100 text-center text-gray-500 py-6 mt-10">
      <p>© 2026 {config.storeName}. All rights reserved.</p>
    </footer>
  )
}