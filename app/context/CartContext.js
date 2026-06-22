"use client"

import { createContext, useContext, useState, useEffect } from "react"
import { supabase } from "../lib/supabase"

const CartContext = createContext()

export function CartProvider({ children }) {
  const [cart, setCart] = useState([])
  const [user, setUser] = useState(null)

  const loadCart = async (userId) => {
    const { data, error } = await supabase
      .from("cart")
      .select("*")
      .eq("user_id", userId)

    if (error) {
      console.error("Load cart error:", error)
      return
    }

    if (data && data.length > 0) {
      const productIds = data.map((item) => item.product_id)
      const { data: products, error: productError } = await supabase
        .from("products")
        .select("*")
        .in("id", productIds)

      if (productError) {
        console.error("Load products error:", productError)
        return
      }

      const loaded = data.map((item) => {
        const product = products.find((p) => p.id === item.product_id)
        return { ...product, quantity: item.quantity, cart_id: item.id }
      })
      setCart(loaded)
    }
  }

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      if (session?.user) loadCart(session.user.id)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        loadCart(session.user.id)
      } else {
        setCart([])
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const addToCart = async (product) => {
    const existing = cart.find((item) => item.id === product.id)

    if (existing) {
      const newQuantity = existing.quantity + 1
      setCart((prev) =>
        prev.map((item) =>
          item.id === product.id ? { ...item, quantity: newQuantity } : item
        )
      )

      if (user) {
        const { error } = await supabase
          .from("cart")
          .update({ quantity: newQuantity })
          .eq("user_id", user.id)
          .eq("product_id", product.id)
        if (error) console.error("Update error:", error)
      }
    } else {
      setCart((prev) => [...prev, { ...product, quantity: 1 }])

      if (user) {
        const { error } = await supabase
          .from("cart")
          .insert({ user_id: user.id, product_id: product.id, quantity: 1 })
        if (error) console.error("Insert error:", error)
      }
    }
  }
  const removeFromCart = async (productId) => {
    setCart((prev) => prev.filter((item) => item.id !== productId))

    if (user) {
      await supabase
        .from("cart")
        .delete()
        .eq("user_id", user.id)
        .eq("product_id", productId)
    }
  }

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0)
  }

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2)
  }

  return (
    <CartContext.Provider value={{ cart, setCart, addToCart, removeFromCart, getTotalItems, getTotalPrice }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  return useContext(CartContext)
}