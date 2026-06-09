import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

export async function POST(request) {
  try {
    const { amount } = await request.json()

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency: "usd",
    })

    return Response.json({ clientSecret: paymentIntent.client_secret })
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }
}