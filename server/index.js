import express from "express";
import fs from "fs";
import { getTimeDifference } from "./utils/getTimeDifference.js";
import cors from "cors";

const app = express();

app.use(cors());

const userRegex =
  /"([a-zA-Z0-9]+)\s?<(\d+)><(STEAM_\d:\d:\d+)><(TERRORIST|CT|Spectator)?>"\s?([a-zA-Z0-9]+)?/;

const teamRegex = /"(\w+)":/;

const switchTeamRegex =
  /"([a-zA-Z0-9]+)\s?<(\d+)><(STEAM_\d:\d:\d+)>" switched from team <(TERRORIST|CT|Unassigned)> to <(TERRORIST|CT)>/;

const killRegex =
  /"([a-zA-Z0-9]+)\s?<(\d+)><(STEAM_\d:\d:\d+)><(TERRORIST|CT|Spectator)?>" \[-?\d+ -?\d+ -?\d+\] killed "([a-zA-Z0-9]+)\s?<(\d+)><(STEAM_\d:\d:\d+)><(TERRORIST|CT|Spectator)?>" (\[-?\d+ -?\d+ -?\d+\]) with "([^"]+)"\s?\(?([^)]+)?/;

const attackRegex =
  /"([a-zA-Z0-9]+)\s?<(\d+)><(STEAM_\d:\d:\d+)><(TERRORIST|CT|Spectator)?>" \[-?\d+ -?\d+ -?\d+\] attacked "([a-zA-Z0-9]+)\s?<(\d+)><(STEAM_\d:\d:\d+)><(TERRORIST|CT|Spectator)?>" \[-?\d+ -?\d+ -?\d+\] with "([^"]+)" \(damage "(\d+)"\) \(damage_armor "(\d+)"\) \(health "(\d+)"\) \(armor "(\d+)"\) \(hitgroup "(\w+)"\)/;

const startRegex = /Round_Start/;

const endRegex = /"Round_End"/;
const teamRoundRegex =
  /Team\splaying\s"(CT|TERRORIST)":\s(TeamVitality|NAVI\sGGBET)/;
const winRegex = /Team ([a-zA-Z0-9]+) won/;
const scoredRegex = /Team ("CT"|"TERRORIST") scored "(\d+)" with "\d" players/;
const SFUIRegex =
  /Team ("TERRORIST"|"CT") triggered "SFUI_Notice_(Terrorists_Win|CTs_Win|Target_Bombed|Bomb_Defused)"/;

const defusedRegex =
  /"([a-zA-Z0-9]+)\s?<(\d+)><(STEAM_\d:\d:\d+)><(TERRORIST|CT|Spectator)?>" triggered "Defused_The_Bomb"/;
const plantRegex =
  /"([a-zA-Z0-9]+)\s?<(\d+)><(STEAM_\d:\d:\d+)><(TERRORIST|CT|Spectator)?>" triggered "Planted_The_Bomb" at bombsite (A|B)/;
const nadeRegex =
  /"([a-zA-Z0-9]+)\s?<(\d+)><(STEAM_\d:\d:\d+)><(TERRORIST|CT|Spectator)?>" threw (\w+) (\[-?\d+ -?\d+ -?\d+\])/;
const moneyRegex =
  /((\d+):(\d+):(\d+)): "([a-zA-Z0-9]+)\s?<(\d+)><(STEAM_\d:\d:\d+)><(TERRORIST|CT|Spectator)?>" money change (\d+)(\+|-)(\d+) = \$(\d+)/;
const flashRegex =
  /"([a-zA-Z0-9]+)\s?<(\d+)><(STEAM_\d:\d:\d+)><(TERRORIST|CT|Spectator)?>" blinded for ([0-9]*\.?[0-9]+) by "([a-zA-Z0-9]+)\s?<(\d+)><(STEAM_\d:\d:\d+)><(TERRORIST|CT|Spectator)?>"/;

app.get("/", async (req, res) => {
  let members = {};
  let roundsSummary = [];
  let teams = [];
  let nadeData = {};
  let round = 0;
  let matchStarted = false;
  let live = false;
  let winner;
  const data = fs.readFileSync("data.txt", "utf-8");

  const lines = data.split("\n");

  for (const line of lines) {
    // Keeping track of teams
    if (line.includes("Team playing")) {
      const parsedLine = line.split(" ");
      const team = parsedLine[6].match(teamRegex);

      if (team) {
        for (const player in members) {
          if (
            !members[player].team &&
            members[player].initialSide === team[1]
          ) {
            members[player].team = parsedLine.slice(7).join(" ").trim();
          }
        }
        const index = teams.findIndex(
          (teamObj) =>
            teamObj.name.trim() === parsedLine.slice(7).join(" ").trim()
        );
        if (index >= 0) {
          teams[index].initialSide = team[1];
        } else {
          teams.push({
            name: parsedLine.slice(7).join(" ").trim(),
            initialSide: team[1],
          });
        }
      }
    }

    // Initialise Players
    const switchMatch = line.substring(23).match(switchTeamRegex);

    if (switchMatch) {
      if (!members[switchMatch[1]]) {
        members[switchMatch[1]] = {
          username: switchMatch[1],
          initialSide: switchMatch[5],
          kills: 0,
          deaths: 0,
          headshots: 0,
          weapons: [],
          grenades: [],
          deathLocations: [],
          highestStreak: 0,
          currentStreak: 0,
          totalDmg: 0,
          bombsDefused: 0,
          bombsPlanted: 0,
          blindedInSec: 0,
          successfullFlashes: 0,
          money: [],
          bodyPartsHit: {},
        };
      } else {
      }
    }
  }

  for (const line of lines) {
    // End of match
    const endGame = line.match(winRegex);
    if (endGame) {
      winner = endGame[1];
      roundsSummary.pop();
      break;
    }

    // checking if match has started
    if (line.includes("Match_Start")) {
      matchStarted = true;
    }

    // checking if match is live
    if (line.includes("LIVE!")) {
      live = true;
    }

    // checking if restarted round or not
    if (line.includes("Restart_Round_(1_second)")) {
      matchStarted = false;
      roundsSummary[round] = null;
    }

    // start of round
    const startMatch = line.match(startRegex);
    if (startMatch && matchStarted && live) {
      const startTime = startMatch.input.split(" ")[2].substring(0, 8);
      let temp = round;

      roundsSummary[round] = {
        ...roundsSummary[round],
        round: ++temp,
        createdAt: startTime,
      };
      for (const team of teams) {
        let teamMembers = [];
        for (const player in members) {
          if (members[player].team == team.name) {
            teamMembers.push({
              [player]: { kills: 0, dmg: 0, username: player },
            });
          }
          roundsSummary[round] = {
            ...roundsSummary[round],
            [team.name]: teamMembers,
          };
        }
      }
    }

    // Initializing teams
    const teamRound = line.match(teamRoundRegex);
    if (teamRound && matchStarted && live) {
      roundsSummary[round] = {
        ...roundsSummary[round],
        [teamRound[1]]: teamRound[2],
      };
    }

    // End of Round
    if (line.includes("Round_End")) {
      const endMatch = line.match(endRegex);
      if (endMatch && matchStarted && live) {
        const endTime = endMatch.input.split(" ")[2].substring(0, 8);
        roundsSummary[round] = {
          ...roundsSummary[round],
          endAt: endTime,
          matchLength: getTimeDifference(
            roundsSummary[round].createdAt,
            endTime
          ),
        };
      }
      round++;
    }

    //Keeping track of attacks
    const attackMatch = line.match(attackRegex);
    if (attackMatch && live && matchStarted) {
      const playerTeam = members[attackMatch[1]].team;
      const attackIndex = roundsSummary[round]?.[playerTeam].findIndex(
        (player) => Object.keys(player)[0] == attackMatch[1]
      );

      if (attackIndex > -1) {
        members[attackMatch[1]].totalDmg +=
          Number(attackMatch[10]) + Number(attackMatch[11]);
        roundsSummary[round][playerTeam][attackIndex][attackMatch[1]].dmg +=
          Number(attackMatch[10]) + Number(attackMatch[11]);
      }

      if (members[attackMatch[5]].bodyPartsHit?.[attackMatch[14]]) {
        members[attackMatch[5]].bodyPartsHit[attackMatch[14]]++;
      } else {
        members[attackMatch[5]].bodyPartsHit = {
          ...members[attackMatch[5]].bodyPartsHit,
          [attackMatch[14]]: 1,
        };
      }
    }

    // Keeping track of kills/headshots/deaths
    const killMatch = line.substring(23).match(killRegex);

    if (killMatch && live && matchStarted) {
      // Increment Kills
      members[killMatch[1]].kills++;
      members[killMatch[1]].currentStreak++;

      if (
        members[killMatch[1]].currentStreak >
        members[killMatch[1]].highestStreak
      )
        members[killMatch[1]].highestStreak =
          members[killMatch[1]].currentStreak;

      // Increment Deaths
      members[killMatch[5]].deaths++;
      members[killMatch[5]].deathLocations.push(killMatch[9]);
      members[killMatch[5]].currentStreak = 0;

      // Increment Headshots

      killMatch[0]?.includes("headshot") && members[killMatch[1]].headshots++;

      // Check if Players had a kill with a specific weapon
      const index = members[killMatch[1]].weapons.findIndex(
        (weapon) => weapon.name === killMatch[10]
      );

      // Update kills of specific weapon
      if (index > -1) {
        members[killMatch[1]].weapons[index].kills++;
      } else {
        members[killMatch[1]].weapons.push({ name: killMatch[10], kills: 1 });
      }

      // Update Round player kills
      const playerTeam = members[killMatch[1]].team;
      const playerIndex = roundsSummary[round][playerTeam].findIndex(
        (player) => Object.keys(player)[0] == killMatch[1]
      );

      if (playerIndex > -1) {
        roundsSummary[round][playerTeam][playerIndex][killMatch[1]].kills++;
      }
    }

    // Keeping track of scores
    const scoredMatch = line.match(scoredRegex);

    if (scoredMatch && live && matchStarted) {
      let team = scoredMatch[1].substring(1, 3) === "CT" ? "CT" : "TERRORIST";

      if (round === 0) {
        roundsSummary[round] = {
          ...roundsSummary[round],
          scores: {
            ...roundsSummary[round].scores,
            [roundsSummary[round][team]]: Number(scoredMatch[2]),
            ...(Number(scoredMatch[2]) === 1 && {
              Winner: roundsSummary[round][team],
              side: team,
            }),
          },
        };
      } else {
        roundsSummary[round] = {
          ...roundsSummary[round],
          scores: {
            ...roundsSummary[round].scores,
            [roundsSummary[round][team]]: Number(scoredMatch[2]),
            ...(Number(scoredMatch[2]) >
              Number(
                roundsSummary[round - 1].scores[roundsSummary[round][team]]
              ) && {
              Winner: roundsSummary[round][team],
              side: team,
            }),
          },
        };
      }
    }

    // Keeping track of win reasons
    const reasonMatch = line.match(SFUIRegex);
    if (reasonMatch && live && matchStarted) {
      switch (reasonMatch[2]) {
        case "CTs_Win":
          roundsSummary[round].reason = "Terrorist Eliminated";
          break;
        case "Terrorists_Win":
          roundsSummary[round].reason = "CTs Eliminated";
          break;
        case "Target_Bombed":
          roundsSummary[round].reason = "C4 Exploded";
          break;
        case "Bomb_Defused":
          roundsSummary[round].reason = "Bomb Defused";
          break;
      }
    }

    // Keeping track of individual bomb defusals
    const defusalMatch = line.match(defusedRegex);

    if (defusalMatch && live && matchStarted) {
      members[defusalMatch[1]].bombsDefused++;
    }

    // Keeping track of individual bomb plants
    const plantMatch = line.match(plantRegex);

    if (plantMatch && live && matchStarted) {
      members[plantMatch[1]].bombsPlanted++;
    }

    // Keeping track of nades
    const nadeMatch = line.match(nadeRegex);

    if (nadeMatch && live && matchStarted) {
      const nadeIndex = members[nadeMatch[1]].grenades.findIndex(
        (nade) => nade.name === nadeMatch[5]
      );

      if (nadeData?.[nadeMatch[5]]) {
        nadeData[nadeMatch[5]].locations.push(nadeMatch[6]);
      } else {
        nadeData = {
          ...nadeData,
          [nadeMatch[5]]: { locations: [nadeMatch[6]] },
        };
      }

      if (nadeIndex > -1) {
        members[nadeMatch[1]].grenades[nadeIndex].thrown++;
      } else {
        members[nadeMatch[1]].grenades.push({
          name: nadeMatch[5],
          thrown: 1,
        });
      }
    }

    // Keeping track of economy
    const moneyMatch = line.match(moneyRegex);

    if (moneyMatch && live && matchStarted) {
      const player = moneyMatch[5];
      members[player].money.push({
        timestamp: moneyMatch[1],
        balance: moneyMatch[12],
      });
    }

    // Keeping track of flash data
    const flashMatch = line.match(flashRegex);

    if (flashMatch && live && matchStarted) {
      if (flashMatch[4] !== "Spectator") {
        const flashee = flashMatch[1];
        const flasher = flashMatch[6];

        members[flashee].blindedInSec += Number(flashMatch[5]);
        members[flasher].successfullFlashes++;
      }
    }
  }

  res.json({ teams, members, roundsSummary, winner });
});

app.listen(5000, () => console.log("Listening to port 5000"));
