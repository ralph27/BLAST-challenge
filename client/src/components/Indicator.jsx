import styles from "@/styles/Indicator.module.css";
import { GiDeathSkull, GiMineExplosion, GiBoltCutter } from "react-icons/gi";

export default function Indicator({
  team1Score,
  team2Score,
  team1Winner,
  team2Winner,
  reason,
  side,
}) {
  return (
    <div className={styles.indicatorWrapper}>
      <p
        className={styles.indicatorScoreLeft}
        style={{
          backgroundColor: team1Winner
            ? side === "CT"
              ? "#4A90E2"
              : "#F5A623"
            : "#171A21",
        }}
      >
        {team1Score}
      </p>
      <div className={styles.indicator}>
        {(reason === "Terrorist Eliminated") | (reason === "CTs Eliminated") ? (
          <GiDeathSkull size={30} />
        ) : reason === "Bomb Defused" ? (
          <GiBoltCutter size={30} />
        ) : (
          reason === "C4 Exploded" && <GiMineExplosion size={30} />
        )}
      </div>
      <p
        className={styles.indicatorScoreRight}
        style={{
          backgroundColor: team2Winner
            ? side === "CT"
              ? "#4A90E2"
              : "#F5A623"
            : "#171A21",
        }}
      >
        {team2Score}
      </p>
    </div>
  );
}
