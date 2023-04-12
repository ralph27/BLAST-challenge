import styles from "@/styles/StatCard.module.css";

export default function StatCard({ children }) {
  return <div className={styles.statCard}>{[...children]}</div>;
}
