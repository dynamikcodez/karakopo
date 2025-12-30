'use client';

import styles from './MealBundleCard.module.css';
import { Plus } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function MealBundleCard({ title, price, image, description }) {
    const { addToCart } = useCart();

    const handleAdd = () => {
        // Generate a unique ID for bundle or serve as single item
        addToCart({ id: title, name: title, price, unit: 'Bundle' });
    };

    return (
        <div className={styles.card}>
            <div className={styles.imagePlaceholder} style={{ background: image }}>
                {/* Real implementation would use Next/Image */}
            </div>
            <div className={styles.content}>
                <div className={styles.header}>
                    <h3 className={styles.title}>{title}</h3>
                    <span className={styles.price}>{price}</span>
                </div>
                <p className={styles.description}>{description}</p>
                <button className={styles.addBtn} onClick={handleAdd}>
                    <Plus size={16} /> Add to List
                </button>
            </div>
        </div>
    );
}
