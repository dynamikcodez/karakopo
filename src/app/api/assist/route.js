import { NextResponse } from 'next/server';
import mealsData from '../../../data/meals.json';
import inventoryData from '../../../data/inventory.json';
import { retrieveContext } from '../../../lib/rag';

export async function POST(request) {
    try {
        const { query } = await request.json();
        const lowerQuery = query.toLowerCase();

        // 1. Try to find a grounded Meal Match
        const matchedMeal = mealsData.find(m =>
            m.name.toLowerCase().includes(lowerQuery) ||
            lowerQuery.includes(m.name.toLowerCase())
        );

        if (matchedMeal) {
            let total = 0;
            const ingredients = matchedMeal.ingredients.map(ing => {
                const invItem = inventoryData.find(i => i.id === ing.inventory_id);
                if (!invItem) return null;

                const cost = invItem.price * ing.qty;
                total += cost;

                return {
                    name: invItem.name,
                    qty: `${ing.qty} x ${invItem.unit}`, // Display logic
                    price: `₦${Math.ceil(cost).toLocaleString()}`,
                    // hidden fields for cart
                    id: invItem.id,
                    realPrice: invItem.price
                };
            }).filter(Boolean);

            return NextResponse.json({
                message: `Found it! Here is what you need for ${matchedMeal.name}:`,
                totalPrice: `₦${Math.ceil(total).toLocaleString()}`,
                ingredients: ingredients,
                recipe: {
                    title: matchedMeal.name,
                    steps: [
                        matchedMeal.description,
                        "1. Prep ingredients.",
                        "2. Cook as usual.",
                        "3. Verify salt and pepper."
                    ]
                }
            });
        }

        // 2. Fallback to RAG Context Search
        const contextResponse = retrieveContext(query);
        if (contextResponse) {
            return NextResponse.json({
                message: `I didn't find a specific recipe card, but here is what seems relevant:\n\n${contextResponse}`
            });
        }

        // 3. Generic Failure / Smart Fallback
        const categories = [...new Set(mealsData.flatMap(m => m.ingredients).map(() => "Rice, Grains, Soups"))]; // Simplified logic for demo
        // Better: just list some popular known categories/meals
        const popularMeals = mealsData.slice(0, 3).map(m => m.name).join(", ");

        return NextResponse.json({
            message: `I couldn't find a specific recipe for "${query}". \n\nHowever, you might be interested in our popular meals: ${popularMeals}. \n\nOr try asking about "Rice", "Stew", or "Soup"!`
        });

    } catch (e) {
        console.error(e);
        return NextResponse.json({ message: "Error processing request." }, { status: 500 });
    }
}
