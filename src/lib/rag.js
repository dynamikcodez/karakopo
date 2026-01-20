import inventoryData from '../data/inventory.json';
import mealsData from '../data/meals.json';

// Simple Keyword Search RAG implementation for MVP
export function retrieveContext(query) {
    const lowerQuery = query.toLowerCase();
    const context = [];

    // 1. Search Meals
    const matchedMeals = mealsData.filter(meal =>
        meal.name.toLowerCase().includes(lowerQuery) ||
        meal.ingredients.some(ing => ing.label.toLowerCase().includes(lowerQuery)) ||
        meal.description.toLowerCase().includes(lowerQuery)
    );

    if (matchedMeals.length > 0) {
        context.push("Here are some meals you can make:");
        matchedMeals.forEach(m => {
            // Calculate generic price
            const price = m.ingredients.reduce((sum, ing) => {
                const invItem = inventoryData.find(i => i.id === ing.inventory_id);
                return sum + (invItem ? invItem.price * ing.qty : 0);
            }, 0);
            context.push(`- ${m.name} (approx ₦${Math.ceil(price)}): ${m.description} Ingredients: ${m.ingredients.map(i => i.label).join(', ')}.`);
        });
    }

    // 2. Search Inventory directly
    const matchedInventory = inventoryData.filter(item =>
        item.name.toLowerCase().includes(lowerQuery) ||
        item.category.toLowerCase().includes(lowerQuery)
    );

    if (matchedInventory.length > 0) {
        context.push("\nI found these ingredients in stock:");
        matchedInventory.forEach(i => {
            context.push(`- ${i.name}: ₦${i.price} / ${i.unit} (${i.stock})`);
        });
    }

    // 3. General Budget/Planning context if queried
    if (lowerQuery.includes('budget') || lowerQuery.includes('cheap')) {
        const cheapMeals = mealsData
            .map(m => {
                const price = m.ingredients.reduce((sum, ing) => {
                    const invItem = inventoryData.find(i => i.id === ing.inventory_id);
                    return sum + (invItem ? invItem.price * ing.qty : 0);
                }, 0);
                return { ...m, price };
            })
            .sort((a, b) => a.price - b.price)
            .slice(0, 3);

        context.push("\nHere are some budget-friendly options:");
        cheapMeals.forEach(m => context.push(`- ${m.name} is one of our most affordable options at ~₦${Math.ceil(m.price)}.`));
    }

    // 4. Fallback if context is still empty
    if (context.length === 0) {
        context.push("I couldn't find a specific match for that.");
        context.push("\nTry asking about these popular categories:");
        const categories = [...new Set(inventoryData.map(i => i.category))].slice(0, 5);
        categories.forEach(c => context.push(`- ${c}`));
        context.push("\nOr ask for 'budget meals' to see our affordable daily options!");
    }

    return context.join("\n");
}
