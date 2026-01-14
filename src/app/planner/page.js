'use client';

import { useState, useMemo } from 'react';
import Navbar from '../../components/Navbar';
import styles from './page.module.css';
import inventoryData from '../../data/inventory.json';
import mealsData from '../../data/meals.json';
import mealPlansData from '../../data/meal_plans.json';
import GlassContainer from '../../components/GlassContainer';
import { useCart } from '../../context/CartContext';

export default function Planner() {
    const [weeklyPlan, setWeeklyPlan] = useState(mealPlansData.default_plan);
    const [selectedSlot, setSelectedSlot] = useState(null); // { day, type }
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { addItemsToCart } = useCart();

    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const mealTypes = ['Breakfast', 'Lunch', 'Supper'];

    // Helper to get Meal Object
    const getMeal = (id) => mealsData.find(m => m.id === id);

    // Helper to get Ingredient Price from Inventory
    const getIngredientPrice = (invId) => {
        const item = inventoryData.find(i => i.id === invId);
        return item ? item.price : 0;
    };

    // Calculate Single Meal Price
    const calculateMealPrice = (mealId) => {
        const meal = getMeal(mealId);
        if (!meal) return 0;
        return meal.ingredients.reduce((total, ing) => {
            return total + (getIngredientPrice(ing.inventory_id) * ing.qty);
        }, 0);
    };

    // Calculate Total Plan Price
    const totalPlanPrice = useMemo(() => {
        let total = 0;
        Object.values(weeklyPlan).forEach(day => {
            Object.values(day).forEach(mealId => {
                if (mealId) total += calculateMealPrice(mealId);
            });
        });
        return total;
    }, [weeklyPlan]);

    const handleSlotClick = (day, type) => {
        setSelectedSlot({ day, type });
        setIsModalOpen(true);
    };

    const handleMealSelect = (mealId) => {
        setWeeklyPlan(prev => ({
            ...prev,
            [selectedSlot.day]: {
                ...prev[selectedSlot.day],
                [selectedSlot.type]: mealId
            }
        }));
        setIsModalOpen(false);
    };

    const handleRemoveMeal = () => {
        setWeeklyPlan(prev => ({
            ...prev,
            [selectedSlot.day]: {
                ...prev[selectedSlot.day],
                [selectedSlot.type]: null
            }
        }));
        setIsModalOpen(false);
    };

    const generateWhatsAppOrder = () => {
        let message = "Hello Karakopo! I want to order this Weekly Meal Plan:\n\n";
        let grandTotal = 0;

        days.forEach(day => {
            message += `*${day}*:\n`;
            mealTypes.forEach(type => {
                const mealId = weeklyPlan[day]?.[type];
                if (mealId) {
                    const meal = getMeal(mealId);
                    const price = calculateMealPrice(mealId);
                    message += `- ${type}: ${meal.name} (₦${price.toLocaleString()})\n`;
                    grandTotal += price;
                }
            });
            message += "\n";
        });

        message += `*Total Estimate: ₦${grandTotal.toLocaleString()}*`;

        // Encode and open
        const url = `https://wa.me/2349012345678?text=${encodeURIComponent(message)}`;
        window.open(url, '_blank');
    };

    const addPlanToCart = () => {
        // Iterate plan, aggregate ingredients
        const toAdd = {}; // { invId: qty }

        Object.values(weeklyPlan).forEach(day => {
            Object.values(day).forEach(mealId => {
                if (!mealId) return;
                const meal = getMeal(mealId);
                meal.ingredients.forEach(ing => {
                    toAdd[ing.inventory_id] = (toAdd[ing.inventory_id] || 0) + ing.qty;
                });
            });
        });

        // Create list of items
        const itemsToAdd = [];
        Object.entries(toAdd).forEach(([invId, qty]) => {
            const item = inventoryData.find(i => i.id === parseInt(invId));
            if (item) {
                const roundedQty = Math.ceil(qty);
                itemsToAdd.push({ ...item, qty: roundedQty });
            }
        });

        if (itemsToAdd.length > 0) {
            addItemsToCart(itemsToAdd);
            alert("Ingredients added to cart!");
        } else {
            alert("No meals in plan to add.");
        }
    };

    return (
        <main className={styles.main}>
            <Navbar />

            <div className={styles.container}>
                <div className={styles.header}>
                    <h1 className={styles.title}>Weekly Meal Planner</h1>
                    <p className={styles.subtitle}>Plan your week, get the ingredients, or order easily.</p>
                </div>

                <div className={styles.grid}>
                    {days.map(day => (
                        <GlassContainer key={day} className={styles.dayColumn}>
                            <div className={styles.dayHeader}>{day}</div>
                            {mealTypes.map(type => {
                                const mealId = weeklyPlan[day]?.[type];
                                const meal = getMeal(mealId);
                                const price = mealId ? calculateMealPrice(mealId) : 0;

                                return (
                                    <div key={type} className={styles.mealSlot} onClick={() => handleSlotClick(day, type)}>
                                        <div className={styles.mealType}>{type}</div>
                                        {meal ? (
                                            <>
                                                <div className={styles.mealName}>{meal.name}</div>
                                                <div className={styles.mealPrice}>~₦{price.toLocaleString()}</div>
                                            </>
                                        ) : (
                                            <div className={styles.emptyState}>Tap to add meal</div>
                                        )}
                                    </div>
                                );
                            })}
                        </GlassContainer>
                    ))}
                </div>
            </div>

            <div className={styles.actions}>
                <div className={styles.totalSection}>
                    <span className={styles.totalLabel}>Estimated Total</span>
                    <span className={styles.totalPrice}>₦{totalPlanPrice.toLocaleString()}</span>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button
                        className={styles.checkoutBtn}
                        style={{ background: '#0984e3' }}
                        onClick={addPlanToCart}
                    >
                        Add to Cart
                    </button>
                    <button className={styles.checkoutBtn} onClick={generateWhatsAppOrder}>
                        WhatsApp Checkout
                    </button>
                </div>
            </div>

            {isModalOpen && (
                <div className={styles.modalOverlay} onClick={() => setIsModalOpen(false)}>
                    <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
                        <div className={styles.modalHeader}>
                            <h3>Select Meal for {selectedSlot.day} {selectedSlot.type}</h3>
                            <button className={styles.closeBtn} onClick={() => setIsModalOpen(false)}>×</button>
                        </div>

                        <div onClick={handleRemoveMeal} className={styles.mealOption} style={{ color: 'red' }}>
                            <b>Start Fasting / Remove Meal</b>
                        </div>

                        {mealsData.map(meal => (
                            <div key={meal.id} className={styles.mealOption} onClick={() => handleMealSelect(meal.id)}>
                                <div>
                                    <div style={{ fontWeight: 'bold' }}>{meal.name}</div>
                                    <div style={{ fontSize: '0.8rem', color: '#666' }}>{meal.description}</div>
                                </div>
                                <div style={{ color: '#00b894' }}>
                                    ₦{calculateMealPrice(meal.id).toLocaleString()}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </main>
    );
}
