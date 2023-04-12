import { useMemo } from "react";
import styles from "@/styles/Table.module.css";

export default function Table({ members, team, winner }) {
  const teamData = useMemo(() => {
    let temp = [];
    for (const member in members) {
      if (members[member].team.trim() === team) {
        temp.push(members[member]);
      }
    }
    return temp;
  }, [members]);

  const getPerc = (base, perc) => {
    return Number((perc * 100) / base).toFixed(1);
  };

  return (
    <div className={styles.tableContainer}>
      <div>
        <h1 className={winner ? styles.positive : styles.negative}>{team}</h1>
      </div>
      <div className={styles.tableWrapper}>
        <div className={styles.tableHeader}>
          <h1>K</h1>
          <h1>D</h1>
          <h1>+/-</h1>
          <h1>HS</h1>
          <h1>HS%</h1>
        </div>
        <div style={{ borderLeft: `4px solid ${winner ? "green" : "red"}` }}>
          {teamData &&
            teamData.map((player) => (
              <div className={styles.tableRow}>
                <h1>{player.username}</h1>
                <div className={styles.tableInfo}>
                  <h1>{player.kills}</h1>
                  <h1>{player.deaths}</h1>
                  <h1
                    className={
                      player.kills - player.deaths > 0
                        ? styles.positive
                        : styles.negative
                    }
                  >
                    {player.kills - player.deaths}
                  </h1>
                  <h1>{player.headshots}</h1>
                  <h1>{getPerc(player.kills, player.headshots)}</h1>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
