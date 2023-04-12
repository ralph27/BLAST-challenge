import Head from "next/head";
import { Inter } from "next/font/google";
import styles from "@/styles/Home.module.css";
import { useQuery } from "react-query";
import axios from "axios";
import Table from "@/components/Table";
import { useContext, useMemo, useState } from "react";
import RoundInfo from "@/components/RoundInfo";
import Card from "@/components/Card";
import { TeamsContext } from "@/context/TeamsContext";
import { MembersContext } from "@/context/MembersContext";
import { RoundsSummaryContext } from "@/context/RoundsSummary";
import { WinnerContext } from "@/context/WinnerContext";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const [roundSelector, setRoundSelector] = useState(1);
  const { teams, setTeams } = useContext(TeamsContext);
  const { members, setMembers } = useContext(MembersContext);
  const { roundsSummary, setRoundsSummary } = useContext(RoundsSummaryContext);
  const { winner, setWinner } = useContext(WinnerContext);

  const { data, isFetched } = useQuery("Teams", async () => {
    const res = await axios.get("http://localhost:5000");
    return res.data;
  });

  if (data && isFetched) {
    setTeams(data.teams);
    setMembers(data.members);
    setRoundsSummary(data.roundsSummary);
    setWinner(data.winner);
  }

  const mvp = useMemo(() => {
    let maxKills = 0;
    let playerMVP;
    let maxDMG;
    if (roundsSummary) {
      let winner = roundsSummary[roundSelector - 1].scores.Winner;
      roundsSummary[roundSelector - 1][winner].map((player) => {
        if (player[Object.keys(player)[0]].kills > maxKills) {
          playerMVP = Object.keys(player)[0];
          maxKills = player[Object.keys(player)[0]].kills;
          maxDMG = player[Object.keys(player)[0]].dmg;
        } else if (
          player[Object.keys(player)[0]].dmg > maxDMG &&
          player[Object.keys(player)[0]].kills === maxKills
        ) {
          playerMVP = Object.keys(player)[0];
          maxDMG = player[Object.keys(player)[0]].dmg;
        }
      });
      return playerMVP;
    }
  }, [roundSelector, roundsSummary]);

  return (
    <>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {teams && roundsSummary && members && (
        <main className={styles.main}>
          <div className={styles.header}>
            <h1 className={styles.headerText}>
              {teams[0].name}:{" "}
              {JSON.stringify(
                roundsSummary[roundsSummary.length - 1].scores[teams[0].name]
              )}
            </h1>
            <div className={styles.headerSub}>
              <p>Map: de_nuke</p>
              <p>Winner: {winner}</p>
            </div>
            <h1 className={styles.headerText}>
              {roundsSummary[roundsSummary.length - 1].scores[teams[1].name]} :
              {teams[1].name}
            </h1>
          </div>
          <h1 className={styles.mainTitle}>Match Summary</h1>
          <div className={styles.tables}>
            <Table
              members={members}
              team={teams[0].name}
              winner={winner === teams[0].name}
            />
            <Table
              members={members}
              team={teams[1].name}
              winner={winner === teams[1].name}
            />
          </div>
          <h1 className={styles.headerText}>Rounds Summary</h1>
          <div className={styles.roundSelector}>
            {roundsSummary.map((round) => (
              <p
                style={{
                  background:
                    roundSelector === round.round ? "#1f2127" : "transparent",
                }}
                onClick={() => setRoundSelector(round.round)}
              >
                {round.round}
              </p>
            ))}
          </div>
          <RoundInfo
            team1={teams[0].name}
            team2={teams[1].name}
            round={roundSelector}
          />

          <div>
            <div className={styles.cardWrapper}>
              {roundsSummary[roundSelector - 1][teams[0].name].map((player) => (
                <Card
                  username={player[Object.keys(player)[0]].username}
                  dmg={player[Object.keys(player)[0]].dmg}
                  kills={player[Object.keys(player)[0]].kills}
                  side={
                    roundsSummary[roundSelector - 1].CT === teams[0].name
                      ? "CT"
                      : "Terrorists"
                  }
                  mvp={mvp}
                />
              ))}
            </div>
            <div className={styles.cardWrapper}>
              {roundsSummary[roundSelector - 1][teams[1].name].map((player) => (
                <Card
                  username={player[Object.keys(player)[0]].username}
                  dmg={player[Object.keys(player)[0]].dmg}
                  kills={player[Object.keys(player)[0]].kills}
                  side={
                    roundsSummary[roundSelector - 1].CT === teams[1].name
                      ? "CT"
                      : "Terrorists"
                  }
                  mvp={mvp}
                />
              ))}
            </div>
          </div>
        </main>
      )}
    </>
  );
}
