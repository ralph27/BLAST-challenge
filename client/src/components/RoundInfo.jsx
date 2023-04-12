import Indicator from "./Indicator";
import styles from "@/styles/RoundInfo.module.css";

export default function RoundInfo({ team1, team2, round, roundsSummary }) {
  return (
    <div>
      <div>
        <h1 style={{ textAlign: "center", margin: "2rem 0" }}>
          Match Length: {roundsSummary[round - 1].matchLength.substring(2)}
        </h1>
        <div className={styles.scoreInfo}>
          <h1>{team1}</h1>
          <Indicator
            team1Score={roundsSummary[round - 1].scores[team1]}
            team2Score={roundsSummary[round - 1].scores[team2]}
            team1Winner={roundsSummary[round - 1].scores.Winner === team1}
            team2Winner={roundsSummary[round - 1].scores.Winner === team2}
            side={roundsSummary[round - 1].scores.side}
            reason={roundsSummary[round - 1].reason}
          />
          <h1>{team2}</h1>
        </div>
      </div>
    </div>
  );
}
