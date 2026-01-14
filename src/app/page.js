import Link from 'next/link';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import MealBundleCard from '../components/MealBundleCard';
import FAQ from '../components/FAQ';
import styles from './page.module.css';

const FEATURED_BUNDLES = [
  {
    title: "The Jollof Starter Pack",
    price: "₦12,500",
    description: "Everything you need: 5kg Rice, Tin Tomatoes, Oil, Spices.",
    image: "#FF6B81"
  },
  {
    title: "Egusi Soup Bundle",
    price: "₦8,000",
    description: "Ground Egusi, Palm Oil, Stockfish, Crayfish, Bitterleaf.",
    image: "#FFA502"
  },
  {
    title: "Fried Rice Combo",
    price: "₦10,500",
    description: "Basmati Rice, Mixed Veggies, Curry, Thyme, Liver.",
    image: "#2ED573"
  }
];

export default function Home() {
  return (
    <main className={styles.main}>
      <Navbar />
      <Hero />

      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Explore Karakopo</h2>
            <p className={styles.sectionSubtitle}>Smart tools for your kitchen.</p>
          </div>

          <div className={styles.grid}>
            {/* Feature Cards */}
            <Link href="/store" className={styles.featureCard}>
              <div className={styles.featureIcon}>🛒</div>
              <h3>Store</h3>
              <p>Shop fresh ingredients instantly.</p>
            </Link>
            <Link href="/planner" className={styles.featureCard}>
              <div className={styles.featureIcon}>📅</div>
              <h3>Weekly Planner</h3>
              <p>Plan meals for the whole week.</p>
            </Link>
            <Link href="/budget" className={styles.featureCard}>
              <div className={styles.featureIcon}>💰</div>
              <h3>Budget Planner</h3>
              <p>Stay within your spending limits.</p>
            </Link>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Featured Meal Bundles</h2>
            <p className={styles.sectionSubtitle}>Get everything you need in one click.</p>
          </div>

          <div className={styles.grid}>
            {FEATURED_BUNDLES.map((bundle, index) => (
              <MealBundleCard key={index} {...bundle} />
            ))}
          </div>
        </div>
      </section>

      <FAQ />

      <footer className={styles.footer}>
        <div className={styles.container}>
          <p>© 2023 Karakopo. Built for Lagos Kitchens.</p>
        </div>
      </footer>
    </main>
  );
}
