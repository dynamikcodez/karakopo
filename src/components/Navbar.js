'use client';

import Link from 'next/link';
import { ShoppingBag, Search, Menu } from 'lucide-react';
import styles from './Navbar.module.css';
import { useCart } from '../context/CartContext';
import StoreAssistantWidget from './StoreAssistantWidget';

export default function Navbar() {
    const { cart, toggleCart } = useCart();

    return (
        <header className={styles.header}>
            <div className={styles.container}>
                <Link href="/" className={styles.logo}>
                    <span className={styles.logoIcon}>KK</span>
                    <span className={styles.logoText}>Kara-kopo</span>
                </Link>

                {/* Desktop Nav */}
                <nav className={styles.nav}>
                    <Link href="/store" className={styles.link}>Store</Link>
                    <Link href="/planner" className={styles.link}>Weekly Planner</Link>
                    <Link href="/budget" className={styles.link}>Budget Plan</Link>
                    <Link href="/assistant" className={styles.link}>AI Chef</Link>
                </nav>

                <div className={styles.actions}>
                    <button className={styles.iconBtn} aria-label="Search">
                        <Search size={22} />
                    </button>
                    {/* Assistant Widget */}
                    <StoreAssistantWidget />

                    <button className={styles.iconBtn} aria-label="Cart" onClick={toggleCart}>
                        <ShoppingBag size={22} />
                        {cart.length > 0 && <span className={styles.badge}>{cart.length}</span>}
                    </button>
                    <button className={styles.menuBtn} aria-label="Menu">
                        <Menu size={24} />
                    </button>
                </div>
            </div>
        </header>
    );
}
