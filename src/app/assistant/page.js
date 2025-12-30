import Navbar from '../../components/Navbar';
import CookingAssistant from '../../components/CookingAssistant';
import styles from './page.module.css';

export default function AssistantPage() {
    return (
        <main className={styles.main}>
            <Navbar />
            <div className={styles.container}>
                <div className={styles.header}>
                    <h1 className={styles.title}>Smart Cooking Assistant</h1>
                    <p className={styles.subtitle}>
                        Tell us what you want to cook. We'll tell you exactly what to buy.
                    </p>
                </div>

                <div className={styles.chatContainer}>
                    <CookingAssistant />
                </div>
            </div>
        </main>
    );
}
