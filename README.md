# ShopStarter

A modern, full-featured e-commerce starter template built with Next.js, Tailwind CSS, Supabase, and Stripe. Launch your own online store in minutes.

## Features

- Product listing with search and category filtering
- Shopping cart that persists across sessions
- User authentication (sign up, login, logout, password reset)
- Stripe checkout integration
- Order history and order confirmation
- Admin dashboard to add, edit and delete products
- Admin image gallery for managing store images
- Fully customizable via a single config file
- SEO ready with metadata, sitemap and robots.txt
---
## Prerequisites

Before you begin, make sure you have:

- [Node.js](https://nodejs.org/) (version 18 or higher) installed on your computer
- A free [Supabase](https://supabase.com) account
- A free [Stripe](https://stripe.com) account
- A code editor like [VS Code](https://code.visualstudio.com/)

---
## 1. Installation

1. Download or clone this repository
2. Open the project folder in your code editor
3. Open a terminal in the project folder and install the dependencies:

```bash
npm install
```

---
## 2. Setting up Supabase

Supabase is the database and authentication system this template uses.

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Wait for the project to finish setting up (this can take a couple of minutes)
3. In the left sidebar, click **Table Editor**
4. Create the following three tables:

### products table

| Column | Type | Notes |
|---|---|---|
| id | int8 | Primary key, auto-increment |
| created_at | timestamptz | Default: now() |
| name | text | |
| price | float4 | |
| category | text | |
| image | text | |
| description | text | |
| stock | int8 | |

### cart table

| Column | Type | Notes |
|---|---|---|
| id | int8 | Primary key, auto-increment |
| created_at | timestamptz | Default: now() |
| user_id | text | |
| product_id | int8 | |
| quantity | int8 | |

### orders table

| Column | Type | Notes |
|---|---|---|
| id | int8 | Primary key, auto-increment |
| created_at | timestamptz | Default: now() |
| user_id | text | |
| items | json | |
| total | float4 | |
| status | text | |
| payment_intent_id | text | |

---
## 3. Setting up Supabase Storage

This template includes an admin image gallery that uses Supabase Storage to hold images for your store.

1. In your Supabase project, click **Storage** in the left sidebar
2. Click **New bucket**
3. Name it `store-images`
4. Check **Public bucket** so images can be displayed on your store
5. Click **Create bucket**
6. Click on the `store-images` bucket, then click **Policies**
7. Click **New policy** → **For full customization** and create these two policies:

**Policy 1 — Public can view images**
- Allowed operation: SELECT
- Target roles: leave empty (public)
- Policy definition: `bucket_id = 'store-images'`

**Policy 2 — Admin can upload and delete**
- Allowed operations: INSERT, DELETE
- Target roles: `authenticated`
- Policy definition: `bucket_id = 'store-images'`

---
## 4. Setting up environment variables

1. In your Supabase project, click **Project Settings** (gear icon) in the left sidebar
2. Click **API**
3. You'll need two values from this page: the **Project URL** and the **anon public key**
4. In your Stripe dashboard, go to **Developers** → **API keys**
5. You'll need two values from this page: the **Publishable key** and the **Secret key**
   - Use your **test mode** keys while setting up — switch to live keys only when you're ready to accept real payments
6. In the root of the project, copy `.env.example` and rename the copy to `.env.local`
7. Open `.env.local` and fill in your values:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_SECRET_KEY=your_stripe_secret_key
NEXT_PUBLIC_ADMIN_EMAIL=your_admin_email@example.com
```

The `NEXT_PUBLIC_ADMIN_EMAIL` should be the email address of the account you want to have admin access — only this email will be able to see the Admin link and access `/admin`.

---
## 5. Configuring authentication redirect URLs

By default, Supabase sends users to a generic URL after they confirm their email, reset their password, etc. You need to tell Supabase where your store lives so these links work correctly.

1. In your Supabase project, click **Authentication** in the left sidebar
2. Click **URL Configuration**
3. Set the **Site URL** to your store's URL:
   - While developing locally: `http://localhost:3000`
   - After deploying: your live site URL (e.g. `https://your-store.vercel.app`)
4. Under **Redirect URLs**, click **Add URL** and add the same URL

You'll need to update these values again once you deploy your store, replacing `http://localhost:3000` with your live URL.

---
## 6. Running the project locally

Once your environment variables and Supabase setup are complete, start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser. You should see your store running!

---
## 7. Customizing your store

ShopStarter is designed to be customized from one place — the `config.js` file in the root of the project.

Open `config.js` and update the values to match your store:

```js
const config = {
  storeName: "Your Store Name",
  storeDescription: "A short description of your store",
  storeEmail: "hello@yourstore.com",

  logo: "/images/logo.png",
  favicon: "/favicon.ico",

  primaryColor: "#000000",
  secondaryColor: "#ffffff",
  accentColor: "#4F46E5",

  currency: "USD",
  currencySymbol: "$",

  heroTitle: "New Arrivals Are Here",
  heroSubtitle: "Shop the latest styles, accessories and more",

  social: {
    twitter: "",
    instagram: "",
    facebook: "",
  },
}
```

| Setting | What it controls |
|---|---|
| `storeName` | The name shown in the navbar, footer, and page titles |
| `storeDescription` | Used in SEO metadata |
| `heroTitle` / `heroSubtitle` | The text shown on your homepage banner |
| `currency` / `currencySymbol` | How prices are displayed |
| `social` | Links to your social media pages |

---
## 8. Adding your products

Once your store is running, log in using the email address set in `NEXT_PUBLIC_ADMIN_EMAIL`. You'll see an **Admin** link in the navbar — click it to open the admin dashboard.

### Uploading images

1. From the admin dashboard, click **Image Gallery**
2. Click **Upload Image** and select an image from your computer
3. Once uploaded, you can copy the image's URL or use it directly when adding a product

### Adding a product

1. From the admin dashboard, click **+ Add Product**
2. Fill in the product name, price, category, and description
3. For the image, either paste an image URL or click **Choose from Gallery** to pick an image you've uploaded
4. Click **Add Product**

### Editing or deleting a product

From the admin dashboard, click **Edit** or **Delete** next to any product.

---
## 9. Deploying your store

Once you're happy with your store locally, you can deploy it for free using [Vercel](https://vercel.com).

1. Push your project to a GitHub repository
2. Go to [vercel.com](https://vercel.com) and sign up (you can sign in with GitHub)
3. Click **Add New** → **Project** and import your GitHub repository
4. Before deploying, add your environment variables:
   - Go to the **Environment Variables** section
   - Add each variable from your `.env.local` file (same names and values)
5. Click **Deploy**

Once deployed, Vercel will give you a live URL (e.g. `https://your-store.vercel.app`).

### Final step — update your Supabase redirect URLs

Go back to Supabase **Authentication → URL Configuration** and update the **Site URL** and **Redirect URLs** to your new live URL, replacing `http://localhost:3000`.

---

## Switching Stripe to live mode

While testing, your Stripe keys are in **test mode** — payments use fake test cards and no real money moves.

When you're ready to accept real payments:

1. In your Stripe dashboard, toggle from **Test mode** to **Live mode**
2. Go to **Developers** → **API keys** and copy your **live** Publishable key and Secret key
3. Update your environment variables (both locally in `.env.local` and on Vercel) with these live keys
4. Redeploy your site on Vercel for the changes to take effect

---

## Support

If you run into any issues setting up ShopStarter, please reach out via shopstater@outlook.com