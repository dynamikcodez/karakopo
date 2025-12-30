'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';
import { Lock } from 'lucide-react';

export default function AdminLogin() {
    const [pin, setPin] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();

    const handleLogin = (e) => {
        e.preventDefault();
        // Mock Auth: PIN is 1234
        if (pin === '1234') {
            // Set cookie manually for demo (Real app would use API/Set-Cookie header)
            document.cookie = "admin_auth=true; path=/";
            router.push('/admin/dashboard');
        } else {
            setError('Invalid PIN');
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <div className={styles.icon}>
                    <Lock size={32} />
                </div>
                <h1 className={styles.title}>Admin Access</h1>
                <form onSubmit={handleLogin} className={styles.form}>
                    <input
                        type="password"
                        placeholder="Enter Admin PIN"
                        className={styles.input}
                        value={pin}
                        onChange={(e) => setPin(e.target.value)}
                    />
                    {error && <p className={styles.error}>{error}</p>}
                    <button type="submit" className={styles.btn}>Unlock Dashboard</button>
                </form>
            </div>
        </div>
    );
}
