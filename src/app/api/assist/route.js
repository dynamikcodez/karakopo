import { NextResponse } from 'next/server';

export async function POST(request) {
    const { query } = await request.json();
    const lowerQuery = query.toLowerCase();

    // 1. Structured/Tailored Match (Mock Database)
    if (lowerQuery.includes('jollof')) {
        return NextResponse.json({
            message: "Great choice! Here are the ingredients you'll need for a standard pot of Jollof Rice.",
            totalPrice: "₦12,500",
            ingredients: [
                { name: "Long Grain Rice", qty: "4 Dericas", price: "₦3,800" },
                { name: "Groundnut Oil", qty: "1 Bottle", price: "₦1,200" },
                { name: "Tin Tomatoes", qty: "3 Tins", price: "₦1,500" },
                { name: "Chicken/Turkey", qty: "1 Kg", price: "₦4,500" },
                { name: "Spices (Curry/Thyme/Maggi)", qty: "Assorted", price: "₦1,500" }
            ],
            recipe: {
                title: "Classic Nigerian Jollof Rice",
                steps: [
                    "Parboil the rice and wash thoroughly.",
                    "Blend tomatoes, peppers, and onions into a smooth paste.",
                    "Fry the puree in oil until the sour taste is gone.",
                    "Add stock, spices, and water. Bring to a boil.",
                    "Add the washed rice, cover seamlessly (use foil), and cook on low heat.",
                    "Allow to steam until soft and fluffy. Party vibe achieved!"
                ]
            }
        });
    }

    // 2. AI Fallback (Mock)
    // In a real implementation, we would call Gemini API here.
    if (lowerQuery.includes('egusi')) {
        return NextResponse.json({
            message: "Egusi Soup is a classic! Based on market availability, here is what you need:",
            totalPrice: "₦9,200",
            ingredients: [
                { name: "Ground Egusi", qty: "2 Cups", price: "₦1,800" },
                { name: "Palm Oil", qty: "1 Bottle", price: "₦1,000" },
                { name: "Ugu/Bitterleaf", qty: "1 Bundle", price: "₦500" },
                { name: "Stockfish", qty: "1 Medium", price: "₦3,500" },
                { name: "Assorted Meats", qty: "0.5 Kg", price: "₦2,400" }
            ],
            recipe: {
                title: "Egusi Soup Method",
                steps: [
                    "Boil meats and stockfish until tender.",
                    "Mix ground egusi with a little water to form a paste.",
                    "Heat palm oil slightly, add egusi paste and fry (lumpy or smooth).",
                    "Add meat stock, water, and cook until it thickens.",
                    "Add crayfish, pepper, and bitterleaf/ugu.",
                    "Simmer for 10 minutes. Serve with Pounded Yam."
                ]
            }
        });
    }

    // Generic Fallback
    return NextResponse.json({
        message: `I can help with "${query}". However, I'm currently in Demo Mode and only have data for Jollof and Egusi. Try asking for "Jollof Rice"!`
    });
}
