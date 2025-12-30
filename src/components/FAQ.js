import styles from './FAQ.module.css';

const faqs = [
    {
        q: "What does 'Sourced by Karakopo' mean?",
        a: "It means we don't hold the stock in our warehouse, but we buy it fresh from the market immediately when you order. It ensures freshness without high storage costs."
    },
    {
        q: "Are the prices final?",
        a: "Prices are estimates based on today's market rates. If there's a significant change at the market, we will notify you before fulfilling the order."
    },
    {
        q: "How does the cooking assistant work?",
        a: "Simply tell us what you want to cook (e.g., 'Fried Rice for 5'), and our AI will list all ingredients and estimated costs for you."
    }
];

export default function FAQ() {
    return (
        <section className={styles.section}>
            <div className={styles.container}>
                <h2 className={styles.title}>Frequently Asked Questions</h2>
                <div className={styles.grid}>
                    {faqs.map((faq, index) => (
                        <div key={index} className={styles.item}>
                            <h3 className={styles.question}>{faq.q}</h3>
                            <p className={styles.answer}>{faq.a}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
