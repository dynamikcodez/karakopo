# Karakopo | Smart Foodstore & Cooking Assistant

Karakopo is a modern, Next.js-based online foodstuff store tailored for the Nigerian market. It features a Smart Cooking Assistant that helps users plan meals, list ingredients, and budget effectively.

## 🚀 Features

*   **Premium Storefront**: Aesthetic, glassmorphism-inspired UI with optimized mobile support.
*   **Smart Assistant**: Chat with an AI (Mocked/RAG) to get ingredient lists for meals like "Jollof Rice" or "Egusi Soup".
*   **Floating Cart**: Real-time cart updates with LocalStorage persistence and **WhatsApp Checkout**.
*   **Admin Dashboard**: secure (PIN: `1234`) interface for owners to manage inventory prices and view search trends.
*   **Meal Bundles**: curated bundles (e.g., "Student Pack") for quick ordering.

## 🛠 Tech Stack

*   **Framework**: Next.js 14+ (App Router)
*   **Styling**: CSS Modules with CSS Variables (No Tailwind by default, custom design system).
*   **Icons**: Lucide React.
*   **State**: React Context API (`CartContext`).

## 🤖 RAG & Assistant Strategy

The "Smart Assistant" uses a **Retrieval-Augmented Generation (RAG)** approach to ensure accuracy and relevance to the store's inventory.

### 1. Structured Data (Primary Source)
The system first checks the Admin/Database for "Official Recipes" or "Meal Kits".
*   **Why**: This ensures that suggested ingredients are *actually in stock* and prices are accurate.
*   **How it works**:
    *   User types "Jollof Rice".
    *   System queries `recipes` table/collection.
    *   If found, it returns the pre-defined ingredient list linked to `product_ids` in our inventory.
    *   **Benefit**: perfect pricing, direct "Add to Cart" integration.

### 2. AI Fallback (Secondary Source)
If the user asks for something not in the database (e.g., "Chinese Fried Rice"), the system falls back to a Generative AI model (e.g., Gemini).
*   **Prompting Strategy**:
    *   *System Prompt*: "You are a Nigerian market assistant. List ingredients for [Dish]. Map these ingredients to generic categories found in a typical Nigerian market (e.g., 'Rice', 'Oil', 'Spices'). Estimate prices if unknown."
*   **Limitation**: Prices are estimates and might not match the store exactly. Use a disclaimer.

## 📋 Ingredient Listing Guidelines

When adding ingredients to the database or instructing results:
*   **Naming**: Use common Nigerian market terms (e.g., "Derica" instead of "Cups").
*   **Quantities**: Be specific (e.g., "1 Bottle", "2 Tubers").
*   **Price**: Always ensure the price reflects the *current* store price.

## 🏃‍♂️ Running Locally

1.  **Install Dependencies**:
    ```bash
    npm install
    ```
2.  **Run Development Server**:
    ```bash
    npm run dev
    ```
3.  **Access App**:
    *   Store: `http://localhost:3000`
    *   Admin: `http://localhost:3000/admin` (PIN: `1234`)

## 📄 License
Proudly built for Karakopo.
