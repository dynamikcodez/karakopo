'use client';

import { useState } from 'react';
import { Package, TrendingUp, Save, Trash, Plus } from 'lucide-react';
import styles from './dashboard.module.css';

// Mock Initial Data
const INITIAL_INVENTORY = [
    { id: 1, name: "Kings Oil", price: 1200, unit: "1 Liter", stock: "In Stock" },
    { id: 2, name: "Rice (Foreign)", price: 1800, unit: "1 Derica", stock: "In Stock" },
    { id: 3, name: "Beans (Oloyin)", price: 900, unit: "1 Derica", stock: "Low Stock" },
];

const ANALYTICS_DATA = [
    { query: "Jollof Rice", count: 124, trend: "+12%" },
    { query: "Egusi Soup", count: 98, trend: "+5%" },
    { query: "Fried Rice", count: 86, trend: "-2%" },
    { query: "Afang", count: 45, trend: "+8%" },
];

export default function AdminDashboard() {
    const [activeTab, setActiveTab] = useState('inventory');
    const [inventory, setInventory] = useState(INITIAL_INVENTORY);
    const [searchStats] = useState(ANALYTICS_DATA);

    // Simple handlers for MVP demo
    const updatePrice = (id, newPrice) => {
        setInventory(prev => prev.map(item => item.id === id ? { ...item, price: newPrice } : item));
    };

    const toggleStock = (id) => {
        const states = ["In Stock", "Low Stock", "Out of Stock"];
        setInventory(prev => prev.map(item => {
            if (item.id === id) {
                const nextIdx = (states.indexOf(item.stock) + 1) % states.length;
                return { ...item, stock: states[nextIdx] };
            }
            return item;
        }));
    };

    return (
        <div className={styles.container}>
            <aside className={styles.sidebar}>
                <div className={styles.logo}>KK Admin</div>
                <nav className={styles.nav}>
                    <button
                        className={`${styles.navBtn} ${activeTab === 'inventory' ? styles.active : ''}`}
                        onClick={() => setActiveTab('inventory')}
                    >
                        <Package size={20} /> Inventory
                    </button>
                    <button
                        className={`${styles.navBtn} ${activeTab === 'analytics' ? styles.active : ''}`}
                        onClick={() => setActiveTab('analytics')}
                    >
                        <TrendingUp size={20} /> Search Trends
                    </button>
                </nav>
            </aside>

            <main className={styles.main}>
                <header className={styles.header}>
                    <h1 className={styles.title}>{activeTab === 'inventory' ? 'Inventory Management' : 'Search Analytics'}</h1>
                    <div className={styles.user}>Owner</div>
                </header>

                {activeTab === 'inventory' ? (
                    <div className={styles.content}>
                        <div className={styles.toolbar}>
                            <div className={styles.toolGroup}>
                                <button className={styles.actionBtn}><Plus size={16} /> Add Item</button>
                                <button className={styles.actionBtn}><Save size={16} /> Save Changes</button>
                            </div>
                            <p className={styles.hint}>Click Status to toggle availability.</p>
                        </div>

                        <table className={styles.table}>
                            <thead>
                                <tr>
                                    <th>Image</th>
                                    <th>Item Name</th>
                                    <th>Unit</th>
                                    <th>Price (₦)</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {inventory.map(item => (
                                    <tr key={item.id}>
                                        <td>
                                            <div className={styles.imgCell}>
                                                {item.image ? <img src={item.image} alt="" /> : <div className={styles.noImg}>Box</div>}
                                                <button className={styles.editImgBtn} onClick={() => {
                                                    const url = prompt("Enter Image URL:", item.image || "");
                                                    if (url !== null) setInventory(prev => prev.map(p => p.id === item.id ? { ...p, image: url } : p));
                                                }}>✎</button>
                                            </div>
                                        </td>
                                        <td>{item.name}</td>
                                        <td>
                                            <select className={styles.select} defaultValue={item.unit}>
                                                <option>1 Liter</option>
                                                <option>1 Derica</option>
                                                <option>1 Paint</option>
                                                <option>1 Kg</option>
                                            </select>
                                        </td>
                                        <td>
                                            <input
                                                type="number"
                                                value={item.price}
                                                onChange={(e) => updatePrice(item.id, e.target.value)}
                                                className={styles.priceInput}
                                            />
                                        </td>
                                        <td>
                                            <span
                                                className={`${styles.badge} ${styles[item.stock.replace(/\s+/g, '').toLowerCase()]}`}
                                                onClick={() => toggleStock(item.id)}
                                            >
                                                {item.stock}
                                            </span>
                                        </td>
                                        <td>
                                            <button className={styles.iconBtn}><Trash size={16} /></button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className={styles.content}>
                        <div className={styles.statsGrid}>
                            <div className={styles.statCard}>
                                <h3>Total Searches</h3>
                                <p className={styles.statValue}>1,240</p>
                                <span className={styles.statTrend}>+12% this week</span>
                            </div>
                            <div className={styles.statCard}>
                                <h3>Conversion Rate</h3>
                                <p className={styles.statValue}>8.5%</p>
                                <span className={styles.statTrend}>+0.5% this week</span>
                            </div>
                        </div>

                        <h2 className={styles.subTitle}>Top Requested Meals</h2>
                        <table className={styles.table}>
                            <thead>
                                <tr>
                                    <th>Meal Name</th>
                                    <th>Requests</th>
                                    <th>Trend</th>
                                </tr>
                            </thead>
                            <tbody>
                                {searchStats.map((stat, i) => (
                                    <tr key={i}>
                                        <td>{stat.query}</td>
                                        <td>{stat.count}</td>
                                        <td className={styles.trend}>{stat.trend}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </main>
        </div>
    );
}
