import config from "../config"
import "./globals.css"
import Navbar from "./components/Navbar"
import Footer from "./components/Footer"
import { CartProvider } from "./context/CartContext"
import Script from "next/script"

export const metadata = {
  title: {
    default: `${config.storeName} — ${config.storeDescription}`,
    template: `%s | ${config.storeName}`,
  },
  description: config.storeDescription,
  keywords: ["fashion", "clothing", "accessories", "shoes", "online store", "shopping"],
  openGraph: {
    title: `${config.storeName} — ${config.storeDescription}`,
    description: config.storeDescription,
    type: "website",
    locale: "en_US",
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-theme={config.theme} suppressHydrationWarning>
      <body>
        <Script id="theme-init" strategy="beforeInteractive">{`
          (function () {
            try {
              var savedTheme = window.localStorage.getItem('shopstarter-theme');
              if (savedTheme) {
                document.documentElement.setAttribute('data-theme', savedTheme);
              }
            } catch (error) {}
          })();
        `}</Script>
        <CartProvider>
          <Navbar />
          <main>{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  )
}