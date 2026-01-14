'use client';

import { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import ProductCard from '../../components/ProductCard';
import { Search } from 'lucide-react';
import styles from './page.module.css';

const CATEGORIES = ["All", "Oils", "Grains", "Tubers", "Spices", "Pantry"];

// Mock Data

export default function StorePage() {
    const [products, setProducts] = useState([]);
    const [activeCategory, setActiveCategory] = useState("All");
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        fetch('/api/products')
            .then(res => res.json())
            .then(data => setProducts(data))
            .catch(err => console.error("Failed to fetch products:", err));
    }, []);

    const filteredProducts = products.filter(product => {
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
