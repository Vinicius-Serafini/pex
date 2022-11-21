import { useEffect, useState } from "react";
import { getTeams } from "src/services/teamService";
import { Team } from "src/types";
import { useAuth } from "./useAuth";

export default function useTeams() {
  const [teams, setTeams] = useState<Array<Team>>([])

  const { user } = useAuth();

  useEffect(() => {
    const handleGetTeams = async (user_id: string) => {
      setTeams(await getTeams(user_id));
    }

    if (user && teams.length == 0) {
      handleGetTeams(user.uid);
    }

  }, [user]);


  return teams;
}