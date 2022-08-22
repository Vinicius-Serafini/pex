import { useContext } from "react";
import { CurrentTeamContext } from "src/contexts/CurrentTeamContext";
import { Team } from "src/types";

export function useCurrentTeam(): { team: Team, lineup: any } {
  const { team, lineup } = useContext(CurrentTeamContext);

  return { team, lineup };
}