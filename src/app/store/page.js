'use client';

import { useState } from 'react';
import Navbar from '../../components/Navbar';
import ProductCard from '../../components/ProductCard';
import { Search } from 'lucide-react';
import styles from './page.module.css';

// Mock Data
const PRODUCTS = [
    { id: 1, name: "Kings Pure Vegetable Oil", price: "₦1,200", size: "1 Liter", category: "Oils" },
    { id: 2, name: "Mamador Vegetable Oil", price: "₦1,350", size: "1 Liter", category: "Oils" },
    { id: 3, name: "Foreign Parboiled Rice", price: "₦1,800", size: "1 Derica", category: "Grains" },
    { id: 4, name: "Honey Beans (Oloyin)", price: "₦900", size: "1 Derica", category: "Grains" },
    { id: 5, name: "Ijebu Garri", price: "₦500", size: "1 Paint", category: "Tubers" },
    { id: 6, name: "Dried Thyme Leaves", price: "₦200", size: "Sachet", category: "Spices" },
    { id: 7, name: "Curry Powder (Lion)", price: "₦250", size: "Sachet", category: "Spices" },
    { id: 8, name: "Dangote Sugar", price: "₦850", size: "1 Packet", category: "Pantry" },
];

const CATEGORIES = ["All", "Oils", "Grains", "Tubers", "Spices", "Pantry"];

export default function StorePage() {
    const [activeCategory, setActiveCategory] = useState("All");
    const [searchQuery, setSearchQuery] = useState("");

    const filteredProducts = PRODUCTS.filter(product => {
        const matchesCategory = activeCategory === "All" || product.category === activeCategory;
        const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    return (
        <main className={styles.main}>
            <Navbar />

            <div className={styles.container}>
                <header className={styles.header}>
                    <h1 className={styles.title}>Market Catalog</h1>

                    <div className={styles.controls}>
                        <div className={styles.searchWrapper}>
                            <Search className={styles.searchIcon} size={20} />
                            <input
                                type="text"
                                placeholder="Search for items..."
                                className={styles.searchInput}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>

                        <div className={styles.categories}>
                            {CATEGORIES.map(cat => (
                                <button
                                    key={cat}
                                    className={`${styles.catBtn} ${activeCategory === cat ? styles.active : ''}`}
                                    onClick={() => setActiveCategory(cat)}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>
                </header>

                <div className={styles.grid}>
                    {filteredProducts.map(product => (
                        <ProductCard key={product.id} {...product} />
                    ))}
                </div>

                {filteredProducts.length === 0 && (
                    <div className={styles.emptyState}>
                        <p>No products found matching "{searchQuery}".</p>
                    </div>
                )}
            </div>
        </main>
    );
}
