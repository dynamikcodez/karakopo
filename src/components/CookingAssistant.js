'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, User, Bot, ShoppingBag } from 'lucide-react';
import styles from './CookingAssistant.module.css';
import { useCart } from '../context/CartContext';

export default function CookingAssistant() {
    const { addToCart } = useCart();
    const [messages, setMessages] = useState([
        {
            role: 'assistant',
            content: "Hello! I'm your Karakopo Assistant. Tell me what you want to cook (e.g., 'Egusi Soup for 4 people'), and I'll list the ingredients and prices for you."
        }
    ]);
    const [activeRecipe, setActiveRecipe] = useState(null);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const bottomRef = useRef(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleAddAll = (ingredients) => {
        ingredients.forEach(item => {
            // Mock ID generation or use name
            addToCart({ id: item.name, name: item.name, price: item.price, unit: 'Unit', size: item.qty });
        });
    };

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMsg = { role: 'user', content: input };
        setMessages(prev => [...prev, userMsg]);
        setInput("");
        setLoading(true);

        try {
            const res = await fetch('/api/assist', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ query: input }),
            });
            const data = await res.json();

            const botMsg = {
                role: 'assistant',
                content: data.message,
                ingredients: data.ingredients, // Optional structured data
                totalPrice: data.totalPrice,
                recipe: data.recipe
            };

            setMessages(prev => [...prev, botMsg]);
        } catch (error) {
            setMessages(prev => [...prev, { role: 'assistant', content: "Sorry, I'm having trouble connecting to the market right now. Please try again." }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.messages}>
                {messages.map((msg, idx) => (
                    <div key={idx} className={`${styles.message} ${styles[msg.role]}`}>
                        <div className={styles.avatar}>
                            {msg.role === 'assistant' ? <Bot size={20} /> : <User size={20} />}
                        </div>
                        <div className={styles.bubble}>
                            <p className={styles.text}>{msg.content}</p>

                            {msg.ingredients && (
                                <div className={styles.recipeCard}>
                                    <h4 className={styles.recipeTitle}>Shopping List (Est. Price: {msg.totalPrice})</h4>
                                    <ul className={styles.ingredientList}>
                                        {msg.ingredients.map((item, i) => (
                                            <li key={i} className={styles.ingredientItem}>
                                                <span>{item.name} ({item.qty})</span>
                                                <span className={styles.price}>{item.price}</span>
                                            </li>
                                        ))}
                                    </ul>
                                    <div className={styles.cardActions}>
                                        <button className={styles.actionBtn} onClick={() => handleAddAll(msg.ingredients)}>
                                            <ShoppingBag size={16} /> Add All
                                        </button>
                                        {msg.recipe && (
                                            <button className={styles.recipeBtn} onClick={() => setActiveRecipe(msg.recipe)}>
                                                📖 View Recipe
                                            </button>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
                {loading && (
                    <div className={`${styles.message} ${styles.assistant}`}>
                        <div className={styles.avatar}><Bot size={20} /></div>
                        <div className={styles.bubble}>
                            <div className={styles.typing}><span>.</span><span>.</span><span>.</span></div>
                        </div>
                    </div>
                )}
                <div ref={bottomRef} />
            </div>

            <form onSubmit={handleSend} className={styles.inputArea}>
                <input
                    type="text"
                    className={styles.input}
                    placeholder="I want to cook..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    disabled={loading}
                />
                <button type="submit" className={styles.sendBtn} disabled={loading || !input.trim()}>
                    <Send size={20} />
                </button>
            </form>
            {/* Recipe Modal */}
            {activeRecipe && (
                <div className={styles.modalOverlay} onClick={() => setActiveRecipe(null)}>
                    <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
                        <div className={styles.modalHeader}>
                            <h3>{activeRecipe.title}</h3>
                            <button onClick={() => setActiveRecipe(null)}>✖</button>
                        </div>
                        <div className={styles.modalBody}>
                            <h4>Instructions:</h4>
                            <ol>
                                {activeRecipe.steps.map((step, i) => (
                                    <li key={i}>{step}</li>
                                ))}
                            </ol>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
