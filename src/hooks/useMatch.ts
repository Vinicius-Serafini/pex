import { useContext } from "react";
import { MatchContext } from "src/contexts/MatchContext";

export function useMatch() {
  const { match, owner, goals, setGoals } = useContext(MatchContext);

  return { match, owner, goals, setGoals };
}