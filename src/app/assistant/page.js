import Navbar from '../../components/Navbar';
import CookingAssistant from '../../components/CookingAssistant';
import styles from './page.module.css';

export default function AssistantPage() {
    return (
        <main className={styles.main}>
            <Navbar />
            <div className={styles.container}>
                <div className={styles.header}>
                    <div style={{ marginBottom: '1rem' }}>
                        <a href="/" style={{ textDecoration: 'none', color: '#636e72', fontSize: '0.9rem' }}>← Back to Home</a>
                    </div>
                    <h1 className={styles.title}>Smart Cooking Assistant</h1>
                    <p className={styles.subtitle}>
                        Tell us what you want to cook. We'll tell you exactly what to buy.
                    </p>
                </div>

                <div className={styles.chatContainer}>
                    <CookingAssistant />
                </div>

                <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                    <a href="/store" className={styles.quickLink} style={{ background: '#dfe6e9', padding: '0.5rem 1rem', borderRadius: '20px', textDecoration: 'none', color: '#2d3436', fontSize: '0.9rem' }}>🛍️ Go to Store</a>
                    <a href="/planner" className={styles.quickLink} style={{ background: '#dfe6e9', padding: '0.5rem 1rem', borderRadius: '20px', textDecoration: 'none', color: '#2d3436', fontSize: '0.9rem' }}>📅 Weekly Planner</a>
                </div>
            </div>
        </main>
    );
}
