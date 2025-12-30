'use client';

import { ShoppingBag, X, Plus, Minus, MessageCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';
import styles from './FloatingCart.module.css';

export default function FloatingCart() {
    const { cart, isOpen, toggleCart, updateQty, removeFromCart, total } = useCart();

    if (!isOpen) return (
        <button className={styles.floater} onClick={toggleCart}>
            <ShoppingBag size={24} />
            {cart.length > 0 && <span className={styles.badge}>{cart.length}</span>}
        </button>
    );

    const handleCheckout = () => {
        // Generate WhatsApp Link
        const phone = "2348000000000"; // Replace with real number
        let message = "Hello Karakopo! I'd like to place an order:\n\n";
        cart.forEach(item => {
            message += `- ${item.qty}x ${item.name} (${item.unit || item.size || 'Unit'})\n`;
        });
        message += `\n*Total Estimate: ₦${total.toLocaleString()}*\n`;
        message += "Please confirm availability.";

        const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
        window.open(url, '_blank');
    };

    return (
        <>
            <div className={styles.overlay} onClick={toggleCart} />
            <div className={styles.cart}>
                <header className={styles.header}>
                    <h3>Your Shopping List</h3>
                    <button className={styles.closeBtn} onClick={toggleCart}><X size={20} /></button>
                </header>

                <div className={styles.items}>
                    {cart.length === 0 ? (
                        <p className={styles.empty}>Your list is empty.</p>
                    ) : (
                        cart.map((item, idx) => (
                            <div key={idx} className={styles.item}>
                                <div className={styles.itemInfo}>
                                    <p className={styles.itemName}>{item.name}</p>
                                    <p className={styles.itemPrice}>{item.price}</p>
                                </div>
                                <div className={styles.controls}>
                                    <button onClick={() => updateQty(item.id, -1)}><Minus size={14} /></button>
                                    <span>{item.qty}</span>
                                    <button onClick={() => updateQty(item.id, 1)}><Plus size={14} /></button>
                                </div>
                                <button className={styles.remove} onClick={() => removeFromCart(item.id)}><X size={14} /></button>
                            </div>
                        ))
                    )}
                </div>

                <div className={styles.footer}>
                    <div className={styles.totalRow}>
                        <span>Estimated Total:</span>
                        <span className={styles.totalPrice}>₦{total.toLocaleString()}</span>
                    </div>
                    <button className={styles.checkoutBtn} onClick={handleCheckout} disabled={cart.length === 0}>
                        <MessageCircle size={20} /> Order via WhatsApp
                    </button>
                </div>
            </div>
        </>
    );
}
