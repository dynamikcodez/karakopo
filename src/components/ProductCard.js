'use client';

import styles from './ProductCard.module.css';
import { Plus } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function ProductCard({ id, name, price, size, image }) {
    const { addToCart } = useCart();

    const handleAdd = () => {
        addToCart({ id, name, price, size, unit: size });
    };

    return (
        <div className={styles.card}>
            <div className={styles.imageWrapper}>
                {image ? (
                    <img src={image} alt={name} className={styles.productImage} />
                ) : (
                    <div className={styles.imagePlaceholder}>
                        <span className={styles.categoryIcon}>📦</span>
                    </div>
                )}
            </div>
            <div className={styles.content}>
                <div className={styles.meta}>
                    <h3 className={styles.name}>{name}</h3>
                    <span className={styles.size}>{size}</span>
                </div>
                <div className={styles.footer}>
                    <span className={styles.price}>{price}</span>
                    <button className={styles.addBtn} onClick={handleAdd}>
                        <Plus size={18} />
                    </button>
                </div>
            </div>
        </div>
    );
}
