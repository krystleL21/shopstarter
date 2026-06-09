import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

export async function POST(request) {
  try {
    const { paymentIntentId, cart, total, userId } = await request.json()

    const { error } = await supabase
      .from("orders")
      .insert({
        user_id: userId,
        items: cart,
        total: total,
        status: "paid",
        payment_intent_id: paymentIntentId,
      })

    if (error) {
      console.error("Order save error:", error)
      return Response.json({ error: error.message }, { status: 500 })
    }

    return Response.json({ success: true })
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }
}