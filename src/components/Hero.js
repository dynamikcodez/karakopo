import styles from './Hero.module.css';
import { Search, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function Hero() {
    return (
        <section className={styles.hero}>
            <div className={styles.container}>
                <div className={styles.content}>
                    <div className={styles.badge}>
                        <span className={styles.badgeDot}></span>
                        Now Serving Iju Ishaga & Environs
                    </div>

                    <h1 className={styles.title}>
                        The Market Comes to <span className={styles.highlight}>Your Kitchen</span>
                    </h1>

                    <p className={styles.subtitle}>
                        From "What should I cook?" to "Ingredients Delivered."
                        Karakopo helps you plan meals, estimate costs, and source authentic Nigerian foodstuffs.
                    </p>

                    <form className={styles.searchForm} action="/assistant">
                        <div className={styles.inputWrapper}>
                            <Search className={styles.searchIcon} size={20} />
                            <input
                                type="text"
                                placeholder="What are you cooking today? (e.g., Egusi Soup)"
                                className={styles.input}
                            />
                        </div>
                        <button type="submit" className={styles.submitBtn}>
                            Ask Assistant
                        </button>
                    </form>

                    <div className={styles.links}>
                        <Link href="/store" className={styles.secondaryLink}>
                            Browse Full Stock <ArrowRight size={16} />
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}
