# 🌟 Full-Stack Amazon Clone

A high-performance, feature-rich, and visually stunning e-commerce clone built using a modern full-stack architecture. This application replicates the core user flows of Amazon, from dynamic product browsing to secure credit card checkouts and order history tracking.

---

## 🚀 Key Features

*   **✨ Seamless User Experience:** Replicates the iconic Amazon branding with custom Vanilla CSS layout grids, sliders, product carousels, responsive sidebars, and fluid interactive feedback.
*   **🔐 Authentication System:** Secure custom sign-in and sign-up flows, along with support for guest profiles for hassle-free browsing.
*   **🛒 Interactive Cart & Wishlist:** Real-time updates for cart quantities, dynamic subtotal, tax and shipping calculations, and a dedicated wishlist to save items for later.
*   **💳 Stripe Payments Integration:** Full secure checkout experience using the Stripe API, handling live payment processing with automatic server-side validation.
*   **📦 Order History & Tracking:** Post-purchase dashboards displaying past orders, order state tracking, estimated delivery dates, and precise item price snapshots.
*   **📧 Automated Email Invoices:** Relies on a transactional mailer using Nodemailer to dispatch confirmation receipts upon successful checkouts.
*   **⚡ Seeding & DB Automations:** Complete database migration paths and automated catalogs seeding to bootstrap the product library immediately.

---

## 🛠️ Technology Stack

| Layer | Technologies Used |
| :--- | :--- |
| **Frontend** | React (Vite), React Router DOM, React Icons, Custom Vanilla CSS |
| **Backend** | Express.js, Node.js, Cors, Dotenv |
| **Database & ORM** | PostgreSQL, Prisma ORM (Prisma Client & Migrate) |
| **Integrations** | Stripe SDK (Payments), Nodemailer (Email Alerts) |

---

## 📊 Database Architecture

The relational schema is mapped via **Prisma ORM** using a PostgreSQL database. Below are the core entities:

```mermaid
erDiagram
    USER ||--o{ CART-ITEM : "owns"
    USER ||--o{ ORDER : "places"
    PRODUCT ||--o{ CART-ITEM : "contained in"
    PRODUCT ||--o{ ORDER-ITEM : "purchased in"
    ORDER ||--o{ ORDER-ITEM : "contains"

    USER {
        string id PK
        string name
        string email UK
        string password
        string phone
        string address
        string city
        string state
        string zipCode
    }

    PRODUCT {
        string id PK
        string name
        string category
        float price
        float originalPrice
        float rating
        int reviewCount
        int stock
        json images
        string description
        json specifications
        string soldBy
        string badge
    }

    CART-ITEM {
        string id PK
        string userId FK
        string productId FK
        int quantity
    }

    ORDER {
        string id PK
        string userId FK
        string firstName
        string lastName
        string address
        string city
        string state
        string zipCode
        string phone
        float subtotal
        float tax
        float shipping
        float total
        string status
        datetime placedAt
        datetime estimatedDelivery
    }

    ORDER-ITEM {
        string id PK
        string orderId FK
        string productId FK
        int quantity
        float price
    }
```

---

## ⚙️ Setup & Installation

### 1. Prerequisites
Make sure you have the following installed on your machine:
*   [Node.js](https://nodejs.org/) (v16+)
*   [PostgreSQL](https://www.postgresql.org/) database server
*   [Stripe Account](https://stripe.com/) (to acquire Stripe API keys)

---

### 2. Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `backend/` root directory and populate it with your environment variables:
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/amazon_clone?schema=public"
   STRIPE_PUBLISHABLE_KEY="your_stripe_publishable_key"
   EMAIL_USER="your_email@gmail.com"
   EMAIL_PASS="your_email_app_password"
   ```
4. Generate the Prisma client & run database migrations:
   ```bash
   npm run prisma:generate
   # Run database migrations to prepare PostgreSQL tables
   npm run prisma:migrate
   ```
5. Seed the database with sample products:
   ```bash
   npm run db:seed
   ```
6. Start the development backend server:
   ```bash
   npm run dev
   ```

---

### 3. Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd ../frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite React development server:
   ```bash
   npm run dev
   ```
4. Open the displayed URL (typically `http://localhost:5173`) in your browser to interact with the project!
