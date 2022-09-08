import { createContext, Dispatch, ReactNode, SetStateAction, useEffect, useState } from "react";
import { useAuth } from "src/hooks/useAuth";
import useLineup from "src/hooks/useLineup";
import { getTeam, removePlayer } from "src/services/teamService";
import { Lineup, LineupObject, Match, Team, TeamObject, User } from "src/types";

type MatchContextProps = {
  match: Match;
  owner: Team;
}

type MatchContextProviderProps = {
  match: Match;
  children: ReactNode;
}

export const MatchContext = createContext({} as MatchContextProps);

export function MatchContextProvider({ match, children }: MatchContextProviderProps) {
  const [_match, setMatch] = useState<Match>({ ...match, date: new Date(match.date) });
  const [owner, setOwner] = useState<Team>()

  const loadTeam = async (uid: string, cb: Dispatch<SetStateAction<any>>) => {
    const team = await getTeam(uid);

    cb(team);
  }

  useEffect(() => {
    if (_match) {
      loadTeam(match.owner, setOwner)

    }
  }, [_match])

  return (
    <MatchContext.Provider value={{ match: _match, owner: owner as Team }}>
      {children}
    </MatchContext.Provider>
  );

}