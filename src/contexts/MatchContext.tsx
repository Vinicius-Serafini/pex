import { createContext, Dispatch, ReactNode, SetStateAction, useEffect, useState } from "react";
import { useAuth } from "src/hooks/useAuth";
import useLineup from "src/hooks/useLineup";
import { getGoalsFromMatch } from "src/services/matchService";
import { getTeam, removePlayer } from "src/services/teamService";
import { Goal, Lineup, LineupObject, Match, Team, TeamObject, User } from "src/types";

type MatchContextProps = {
  match: Match;
  owner: Team;
  goals: Array<Goal>
  setGoals: Dispatch<SetStateAction<any>>
}

type MatchContextProviderProps = {
  match: Match;
  children: ReactNode;
}

export const MatchContext = createContext({} as MatchContextProps);

export function MatchContextProvider({ match, children }: MatchContextProviderProps) {
  const [_match, setMatch] = useState<Match>({ ...match, date: new Date(match.date) });
  const [owner, setOwner] = useState<Team>()
  const [goals, setGoals] = useState<Array<Goal>>([]);


  const loadTeam = async (uid: string, cb: Dispatch<SetStateAction<any>>) => {
    const team = await getTeam(uid);

    cb(team);
  }

  const loadGoals = async (match: Match) => {
    const _goals = await getGoalsFromMatch(match);

    setGoals(_goals);
  }

  useEffect(() => {
    if (_match) {
      if (typeof match.owner == 'string') {
        loadTeam(match.owner, setOwner)
      } else {
        setOwner(match.owner)
      }

      loadGoals(_match);
    }
  }, [_match])

  return (
    <MatchContext.Provider value={{ match: _match, owner: owner as Team, goals, setGoals }}>
      {children}
    </MatchContext.Provider>
  );

}