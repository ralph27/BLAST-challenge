import { MembersContext } from "@/context/MembersContext";
import { RoundsSummaryContext } from "@/context/RoundsSummary";
import { TeamsContext } from "@/context/TeamsContext";
import { WinnerContext } from "@/context/WinnerContext";
import "@/styles/globals.css";
import { useState } from "react";
import { QueryClient, QueryClientProvider } from "react-query";

export default function App({ Component, pageProps }) {
  const queryClient = new QueryClient();
  const [teams, setTeams] = useState();
  const [members, setMembers] = useState();
  const [roundsSummary, setRoundsSummary] = useState();
  const [winner, setWinner] = useState();

  return (
    <WinnerContext.Provider value={{ winner, setWinner }}>
      <RoundsSummaryContext.Provider
        value={{ roundsSummary, setRoundsSummary }}
      >
        <MembersContext.Provider value={{ members, setMembers }}>
          <TeamsContext.Provider value={{ teams, setTeams }}>
            <QueryClientProvider client={queryClient}>
              <Component {...pageProps} />
            </QueryClientProvider>
          </TeamsContext.Provider>
        </MembersContext.Provider>
      </RoundsSummaryContext.Provider>
    </WinnerContext.Provider>
  );
}
