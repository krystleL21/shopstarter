import "./globals.css"
import Navbar from "./components/Navbar"
import Footer from "./components/Footer"
import { CartProvider } from "./context/CartContext"

export const metadata = {
  title: {
    default: "MyStore — Shop the Latest Styles",
    template: "%s | MyStore",
  },
  description: "Shop the latest fashion, accessories, shoes and more at MyStore. Fast shipping, easy returns, secure checkout.",
  keywords: ["fashion", "clothing", "accessories", "shoes", "online store", "shopping"],
  openGraph: {
    title: "MyStore — Shop the Latest Styles",
    description: "Shop the latest fashion, accessories, shoes and more at MyStore.",
    type: "website",
    locale: "en_US",
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <CartProvider>
          <Navbar />
          <main>{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  )
}