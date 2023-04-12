import styles from "@/styles/PlayerCard.module.css";
import Link from "next/link";
import { FaCrown } from "react-icons/fa";
export default function Card({ username, side, kills, dmg, mvp }) {
  return (
    <Link
      href={`/player/${username}`}
      className={styles.playerCard}
      style={{
        border: side === "CT" ? "1px solid #4A90E2" : "1px solid #F5A623",
      }}
    >
      {username === mvp && <FaCrown color="gold" />}
      <h1 className={styles.cardTitle}>{username}</h1>
      <div>
        <div className={styles.cardStat}>Kills: {kills}</div>
        <div className={styles.cardStat}>damage: {dmg}</div>
      </div>
    </Link>
  );
}
