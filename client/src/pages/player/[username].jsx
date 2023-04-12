"use client";

import { useRouter } from "next/router";
import styles from "@/styles/Details.module.css";
import { useContext, useMemo, useState } from "react";
import { MembersContext } from "@/context/MembersContext";
import StatCard from "@/components/StatCard";
import {
  GiBlindfold,
  GiBoltCutter,
  GiBrightExplosion,
  GiChestArmor,
  GiFireSilhouette,
  GiFlashGrenade,
  GiGrenade,
  GiHeadshot,
  GiMolotov,
  GiNuclearBomb,
  GiSmokeBomb,
  GiStomach,
} from "react-icons/gi";
import LineChart from "@/components/LineChat";

export default function Page() {
  const router = useRouter();
  const { username } = router.query;
  const { members, setMembers } = useContext(MembersContext);

  const getIcon = (e) => {
    switch (e) {
      case "head":
        return <GiHeadshot />;
      case "stomach":
        return <GiStomach />;
      case "chest":
        return <GiChestArmor />;
      case "molotov":
        return <GiMolotov />;
      case "smokegrenade":
        return <GiSmokeBomb />;
      case "flashbang":
        return <GiFlashGrenade />;
      case "hegrenade":
        return <GiGrenade />;
      default:
        <p>test</p>;
    }
  };

  const stats = useMemo(() => {
    if (members) {
      return members[username];
    }
  }, [members]);

  const chartData = useMemo(() => {
    if (members) {
      return {
        labels: members[username].money?.map((label) => label.timestamp),
        datasets: [
          {
            label: "Balance Over Time",
            data: members[username].money?.map((label) => label.balance),
          },
        ],
      };
    }
  }, [members]);

  return (
    <main className={styles.main}>
      <h1 className={styles.headerText}>{username}</h1>
      {stats && (
        <div className={styles.sub}>
          <h1>Game Stats</h1>
          <div className={styles.startCardWrapper}>
            <StatCard>
              <h1 className={styles.statTitle}>General</h1>
              <div className={styles.statsList}>
                <p>
                  <GiBrightExplosion /> Total Damage: {stats.totalDmg}
                </p>
                <p>
                  <GiFlashGrenade /> Successfull Flashes:{" "}
                  {stats.successfullFlashes}
                </p>
                <p>
                  <GiBlindfold /> Total Flash Time:{" "}
                  {stats.blindedInSec.toFixed(1)}
                </p>
                <p>
                  <GiFireSilhouette /> Highest Streak: {stats.highestStreak}
                </p>
                <p>
                  <GiBoltCutter />
                  Bombs Defused: {stats.bombsDefused}
                </p>
                <p>
                  <GiNuclearBomb /> Bombs Planted: {stats.bombsPlanted}
                </p>
              </div>
            </StatCard>

            <StatCard>
              <h1>Body Parts Hit</h1>
              <div className={styles.statsList}>
                {Object.keys(stats.bodyPartsHit).map((bodyPart) => (
                  <p>
                    {getIcon(bodyPart)}
                    {bodyPart}: {stats.bodyPartsHit[bodyPart]}
                  </p>
                ))}
              </div>
            </StatCard>

            <StatCard>
              <h1>Favorite Weapons</h1>
              <div className={styles.statsList}>
                {stats.weapons.map((weapon) => (
                  <p>
                    {weapon.name}: {weapon.kills}
                  </p>
                ))}
              </div>
            </StatCard>

            <StatCard>
              <h1>Favorite Weapons</h1>
              <div className={styles.statsList}>
                {stats.grenades.map((grenade) => (
                  <p>
                    {getIcon(grenade.name)}
                    {grenade.name}: {grenade.thrown}
                  </p>
                ))}
              </div>
            </StatCard>
          </div>
        </div>
      )}
      {members && <LineChart data={chartData} />}
    </main>
  );
}
