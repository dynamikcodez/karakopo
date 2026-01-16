'use client';

import { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, X, Sparkles } from 'lucide-react';
import styles from './StoreAssistantWidget.module.css';

export default function StoreAssistantWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState('');
    const [messages, setMessages] = useState([
        { role: 'ai', content: 'Hello! I am your Karakopo Kitchen Assistant. How can I help you plan your meal or shop today?' }
    ]);
    const [isLoading, setIsLoading] = useState(false);
    const [showSuggestions, setShowSuggestions] = useState(false);

    const SUGGESTED_QUESTIONS = [
        "What does Jollof rice cost to make?",
        "Build me a meal plan for the week.",
        "How much does food for a month cost?",
        "What are some budget-friendly meals?",
        "How do I make Efo Riro?",
        "List ingredients for Fried Rice."
    ];

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async (text = query) => {
        if (!text.trim()) return;

        const userMsg = { role: 'user', content: text };
        setMessages(prev => [...prev, userMsg]);
        setQuery('');
        setShowSuggestions(false);
        setIsLoading(true);

        try {
            const res = await fetch('/api/assist', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ query: userMsg.content }),
            });
            const data = await res.json();

            // Format response if it has ingredients/price
            let aiContent = data.message;
            if (data.totalPrice) {
                // Formatting for grounded matches
                aiContent = (
                    <div>
                        <p>{data.message}</p>
                        <ul style={{ paddingLeft: '1.2rem', margin: '0.5rem 0' }}>
                            {data.ingredients.slice(0, 3).map((ing, i) => (
                                <li key={i}>{ing.qty} {ing.name}</li>
                            ))}
                            {data.ingredients.length > 3 && <li>...and {data.ingredients.length - 3} more</li>}
                        </ul>
                        <p><strong>Est. Total: {data.totalPrice}</strong></p>
                    </div>
                );
            }

            setMessages(prev => [...prev, { role: 'ai', content: aiContent }]);
        } catch (error) {
            setMessages(prev => [...prev, { role: 'ai', content: "Sorry, I'm having trouble connecting to the kitchen server right now." }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') handleSend();
    };

    return (
        <>
            <button
                className={styles.iconBtn}
                onClick={() => setIsOpen(!isOpen)}
                aria-label="Toggle Assistant"
                style={{ color: isOpen ? '#0984e3' : 'inherit' }}
            >
                <Sparkles size={22} />
            </button>

            {isOpen && (
                <div className={styles.modalOverlay} onClick={() => setIsOpen(false)}>
                    <div className={styles.widgetContainer} onClick={e => e.stopPropagation()}>
                        <div className={styles.header}>
                            <div className={styles.headerTitle}>
                                <Sparkles size={18} fill="#0984e3" color="#0984e3" />
                                AI Kitchen Assistant
                            </div>
                            <button className={styles.closeBtn} onClick={() => setIsOpen(false)}>
                                <X size={20} />
                            </button>
                        </div>

                        <div className={styles.chatContent}>
                            {messages.map((msg, idx) => (
                                <div key={idx} className={`${styles.message} ${msg.role === 'user' ? styles.userMessage : styles.aiMessage}`}>
                                    {msg.content}
                                </div>
                            ))}
                            {isLoading && (
                                <div className={`${styles.message} ${styles.aiMessage}`}>
                                    <div className={styles.typingIndicator}>
                                        <div className={styles.dot}></div>
                                        <div className={styles.dot}></div>
                                        <div className={styles.dot}></div>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {showSuggestions && (
                            <div className={styles.suggestionsMenu}>
                                {SUGGESTED_QUESTIONS.map((q, idx) => (
                                    <div
                                        key={idx}
                                        className={styles.suggestionItem}
                                        onClick={() => handleSend(q)}
                                    >
                                        {q}
                                    </div>
                                ))}
                            </div>
                        )}

                        <div className={styles.inputArea}>
                            <button
                                className={styles.suggestionBtn}
                                onClick={() => setShowSuggestions(!showSuggestions)}
                                title="Suggested Questions"
                            >
                                <div style={{ fontSize: '1.2rem' }}>💡</div>
                            </button>
                            <input
                                type="text"
                                className={styles.input}
                                placeholder="Ask about recipes, ingredients..."
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                onKeyPress={handleKeyPress}
                                autoFocus
                            />
                            <button className={styles.sendBtn} onClick={() => handleSend()} disabled={isLoading}>
                                <Send size={16} />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
