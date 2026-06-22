"use client"

import { useEffect, useState } from "react"
import config from "../../config"

const themeKeys = ["classic", "streetwear", "harvest"]

function getThemeFromStorage() {
  if (typeof window === "undefined") {
    return config.theme
  }

  const savedTheme = window.localStorage.getItem("shopstarter-theme")
  if (savedTheme && themeKeys.includes(savedTheme)) {
    return savedTheme
  }

  const currentTheme = document.documentElement.getAttribute("data-theme")
  if (currentTheme && themeKeys.includes(currentTheme)) {
    return currentTheme
  }

  return config.theme
}

export default function useCurrentTheme() {
  const [theme, setTheme] = useState(getThemeFromStorage)

  useEffect(() => {
    const handleThemeChange = (event) => {
      if (event?.detail && themeKeys.includes(event.detail)) {
        setTheme(event.detail)
      }
    }

    const handleStorageChange = (event) => {
      if (event.key === "shopstarter-theme" && themeKeys.includes(event.newValue)) {
        setTheme(event.newValue)
      }
    }

    window.addEventListener("shopstarter-theme-change", handleThemeChange)
    window.addEventListener("storage", handleStorageChange)

    return () => {
      window.removeEventListener("shopstarter-theme-change", handleThemeChange)
      window.removeEventListener("storage", handleStorageChange)
    }
  }, [])

  return theme
}
