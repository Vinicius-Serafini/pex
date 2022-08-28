import { useContext } from "react";
import { CurrentTeamContext } from "src/contexts/CurrentTeamContext";
import { Team, TeamObject } from "src/types";

export function useCurrentTeam(): { team: TeamObject, lineup: any } {
  const { team, lineup } = useContext(CurrentTeamContext);

  return { team, lineup };
}