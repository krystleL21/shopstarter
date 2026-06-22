import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

export async function POST(request) {
  try {
    const authorizationHeader = request.headers.get("authorization") || ""
    const accessToken = authorizationHeader.startsWith("Bearer ")
      ? authorizationHeader.slice(7)
      : ""

    if (!accessToken) {
      return Response.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data: userData, error: userError } = await supabase.auth.getUser(accessToken)

    if (userError || !userData?.user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { paymentIntentId, cart, total } = await request.json()

    const { error } = await supabase
      .from("orders")
      .insert({
        user_id: userData.user.id,
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