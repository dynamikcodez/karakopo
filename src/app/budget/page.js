'use client';

import { useState } from 'react';
import Navbar from '../../components/Navbar';
import inventoryData from '../../data/inventory.json';
import mealsData from '../../data/meals.json';
import GlassContainer from '../../components/GlassContainer';
import styles from './page.module.css';

export default function BudgetPlanner() {
    const [budget, setBudget] = useState(5000);
    const [mealsPerDay, setMealsPerDay] = useState(2);
    const [generatedPlan, setGeneratedPlan] = useState(null);

    // Helper: Calculate Price
    const getMealPrice = (meal) => {
        return meal.ingredients.reduce((total, ing) => {
            const item = inventoryData.find(i => i.id === ing.inventory_id);
            return total + (item ? item.price * ing.qty : 0);
        }, 0);
    };

    const generatePlan = () => {
        // 1. Get all meals with prices
        const pricedMeals = mealsData.map(m => ({ ...m, realPrice: getMealPrice(m) })).sort((a, b) => a.realPrice - b.realPrice);

        // 2. Determine target slots: 6 days * mealsPerDay
        const totalSlots = 6 * mealsPerDay;
        const targetAvg = budget / totalSlots;

        // 3. Simple Greedy Selection
        // Filter accessible meals (cheaper than budget)
        let candidates = pricedMeals.filter(m => m.realPrice <= budget);

        if (candidates.length === 0) {
            alert("Budget too low for any single meal!");
            return;
        }

        const plan = {};
        const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        let currentTotal = 0;

        // Shuffle candidates for variety
        candidates = candidates.sort(() => 0.5 - Math.random());

        // Try to fill slots
        let slotCount = 0;
        days.forEach(day => {
            plan[day] = [];
            for (let i = 0; i < mealsPerDay; i++) {
                // Find a meal that fits remaining budget
                // Strategy: Pick random candidate that doesn't break bank?
                // MVP: Just pick one of the cheaper ones if tight, or random if loose.

                // Re-sort/filter candidates dynamically? No, simple logic:
                // Just loop candidates to find one that fits "remaining budget / remaining slots" ideally?
                // Let's just pick random reachable ones.
                const validMeals = candidates.filter(m => (currentTotal + m.realPrice) <= budget);

                if (validMeals.length > 0) {
                    // Pick one
                    const pick = validMeals[Math.floor(Math.random() * validMeals.length)];
                    plan[day].push(pick);
                    currentTotal += pick.realPrice;
                    slotCount++;
                } else {
                    // Can't afford more
                    plan[day].push(null);
                }
            }
        });

        setGeneratedPlan({ plan, total: currentTotal, count: slotCount });
    };

    const handleWhatsAppCheckout = () => {
        if (!generatedPlan) return;
        let message = `Hello! I have a budget of ₦${budget} and here is my generated meal plan:\n\n`;
        const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

        days.forEach(day => {
            const meals = generatedPlan.plan[day];
            if (meals && meals.length > 0) {
                const names = meals.filter(m => m).map(m => `${m.name} (₦${Math.ceil(m.realPrice)})`).join(", ");
                if (names) message += `*${day}*: ${names}\n`;
            }
        });

        message += `\n*Total Cost: ₦${Math.ceil(generatedPlan.total).toLocaleString()}*`;

        const url = `https://wa.me/2349012345678?text=${encodeURIComponent(message)}`;
        window.open(url, '_blank');
    };

    return (
        <main className={styles.container}>
            <Navbar />
            <div className={styles.wrapper}>
                <GlassContainer className={styles.content}>
                <h1 className={styles.title}>Budget Meal Planner</h1>
                <p>Tell us your budget, we'll feed you for the week.</p>

                <div className={styles.controls}>
                    <div className={styles.inputGroup}>
                        <label>Weekly Budget (₦)</label>
                        <input
                            type="number"
                            value={budget}
                            onChange={e => setBudget(parseInt(e.target.value))}
                            step="500"
                            min="1000"
                        />
                    </div>
                    <div className={styles.inputGroup}>
                        <label>Meals Per Day</label>
                        <select value={mealsPerDay} onChange={e => setMealsPerDay(parseInt(e.target.value))}>
                            <option value="1">1 Meal</option>
                            <option value="2">2 Meals (Lunch/Dinner)</option>
                            <option value="3">3 Meals (Full)</option>
                        </select>
                    </div>
                    <button onClick={generatePlan} className={styles.generateBtn}>
                        Generate Plan
                    </button>
                </div>

                {generatedPlan && (
                    <div className={styles.results}>
                        <h2 className={styles.resultTitle}>
                            Your ₦{Math.ceil(generatedPlan.total).toLocaleString()} Plan
                        </h2>

                        <div className={styles.planList}>
                            {Object.entries(generatedPlan.plan).map(([day, meals]) => (
                                <div key={day} className={styles.dayRow}>
                                    <span className={styles.dayName}>{day}</span>
                                    <div className={styles.dayMeals}>
                                        {meals.map((meal, idx) => (
                                            meal ? (
                                                <span key={idx} className={styles.mealBadge}>
                                                    {meal.name}
                                                </span>
                                            ) : <span key={idx} className={styles.emptyBadge}>Skipped (Budget Limit)</span>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <button onClick={handleWhatsAppCheckout} className={styles.whatsappBtn}>
                            Order via WhatsApp
                        </button>
                    </div>
                )}
                </GlassContainer>
            </div>
        </main>
    );
}
