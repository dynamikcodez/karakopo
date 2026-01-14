'use client';

import { useState, useEffect } from 'react';
import { Package, TrendingUp, Save, Trash, Plus, FileJson, Calendar } from 'lucide-react';
import GlassContainer from '../../../components/GlassContainer';
import styles from './dashboard.module.css';

export default function AdminDashboard() {
    const [activeTab, setActiveTab] = useState('inventory');
    const [inventory, setInventory] = useState([]);
    const [mealsJson, setMealsJson] = useState('');
    const [plansJson, setPlansJson] = useState('');

    // Inventory Management
    useEffect(() => {
        if (activeTab === 'inventory') fetchInventory();
        if (activeTab === 'meals') fetchJson('meals', setMealsJson);
        if (activeTab === 'plans') fetchJson('plans', setPlansJson);
    }, [activeTab]);

    const fetchInventory = async () => {
        const res = await fetch('/api/admin/update-data?type=inventory');
        const data = await res.json();
        setInventory(data);
    };

    const fetchJson = async (type, setter) => {
        const res = await fetch(`/api/admin/update-data?type=${type}`);
        const data = await res.json();
        setter(JSON.stringify(data, null, 2));
    };

    const saveJson = async (type, jsonString) => {
        try {
            const data = JSON.parse(jsonString);
            const res = await fetch('/api/admin/update-data', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ type, data })
            });
            if (res.ok) alert(`${type} updated successfully! Check the planner to see changes.`);
            else alert('Failed to update.');
        } catch (e) {
            alert("Invalid JSON format. Please check your syntax.");
        }
    };

    const updateInventoryItem = async (updatedItem) => {
        const newInv = inventory.map(item => item.id === updatedItem.id ? updatedItem : item);
        setInventory(newInv);
        // Persist
        await fetch('/api/admin/update-data', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ type: 'inventory', data: newInv })
        });
    };

    const deleteInventoryItem = async (id) => {
        if (!confirm("Delete this item?")) return;
        const newInv = inventory.filter(item => item.id !== id);
        setInventory(newInv);
        await fetch('/api/admin/update-data', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ type: 'inventory', data: newInv })
        });
    };

    const addInventoryItem = async () => {
        const name = prompt("Name:");
        if (!name) return;
        const price = prompt("Price:");
        const maxId = inventory.reduce((max, i) => Math.max(max, i.id), 0);
        const newItem = {
            id: maxId + 1,
            name,
            price: parseInt(price),
            unit: 'Unit',
            category: 'General',
            stock: 'In Stock'
        };
        const newInv = [...inventory, newItem];
        setInventory(newInv);
        await fetch('/api/admin/update-data', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ type: 'inventory', data: newInv })
        });
    };

    return (
        <div className={styles.container}>
            <GlassContainer className={styles.sidebar}>
                <div className={styles.logo}>KK Admin</div>
                <nav className={styles.nav}>
                    <button className={`${styles.navBtn} ${activeTab === 'inventory' ? styles.active : ''}`} onClick={() => setActiveTab('inventory')}>
                        <Package size={20} /> Inventory
                    </button>
                    <button className={`${styles.navBtn} ${activeTab === 'meals' ? styles.active : ''}`} onClick={() => setActiveTab('meals')}>
                        <FileJson size={20} /> Meals Data
                    </button>
                    <button className={`${styles.navBtn} ${activeTab === 'plans' ? styles.active : ''}`} onClick={() => setActiveTab('plans')}>
                        <Calendar size={20} /> Weekly Plans
                    </button>
                </nav>
            </GlassContainer>

            <main className={styles.main}>
                <header className={styles.header}>
                    <h1 className={styles.title}>
                        {activeTab === 'inventory' && 'Inventory Management'}
                        {activeTab === 'meals' && 'Meal Database Editor'}
                        {activeTab === 'plans' && 'Weekly Plans Editor'}
                    </h1>
                </header>

                <GlassContainer className={styles.content}>
                    {activeTab === 'inventory' && (
                        <div>
                            <div className={styles.toolbar}>
                                <button className={styles.actionBtn} onClick={addInventoryItem}>+ Add Item</button>
                            </div>
                            <table className={styles.table}>
                                <thead>
                                    <tr><th>ID</th><th>Name</th><th>Price</th><th>Stock</th><th>Action</th></tr>
                                </thead>
                                <tbody>
                                    {inventory.map(item => (
                                        <tr key={item.id}>
                                            <td>{item.id}</td>
                                            <td>{item.name}</td>
                                            <td>
                                                <input
                                                    type="number"
                                                    value={item.price}
                                                    onChange={e => updateInventoryItem({ ...item, price: parseInt(e.target.value) })}
                                                    style={{ width: '80px', padding: '4px' }}
                                                />
                                            </td>
                                            <td onClick={() => updateInventoryItem({ ...item, stock: item.stock === 'In Stock' ? 'Out of Stock' : 'In Stock' })} style={{ cursor: 'pointer', fontWeight: 'bold', color: item.stock === 'In Stock' ? 'green' : 'red' }}>
                                                {item.stock}
                                            </td>
                                            <td><button onClick={() => deleteInventoryItem(item.id)}>🗑️</button></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {activeTab === 'meals' && (
                        <div style={{ height: 'calc(100vh - 200px)', display: 'flex', flexDirection: 'column' }}>
                            <p className={styles.hint}>Edit the raw JSON for meals here. Be careful with syntax!</p>
                            <textarea
                                className={styles.jsonEditor}
                                value={mealsJson}
                                onChange={e => setMealsJson(e.target.value)}
                            />
                            <button className={styles.saveBtn} onClick={() => saveJson('meals', mealsJson)}>Save Meals Data</button>
                        </div>
                    )}

                    {activeTab === 'plans' && (
                        <div style={{ height: 'calc(100vh - 200px)', display: 'flex', flexDirection: 'column' }}>
                            <p className={styles.hint}>Edit the Weekly Schedule here.</p>
                            <textarea
                                className={styles.jsonEditor}
                                value={plansJson}
                                onChange={e => setPlansJson(e.target.value)}
                            />
                            <button className={styles.saveBtn} onClick={() => saveJson('plans', plansJson)}>Save Weekly Plan</button>
                        </div>
                    )}
                </GlassContainer>
            </main>
        </div>
    );
}
