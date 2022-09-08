import { useContext } from "react";
import { MatchContext } from "src/contexts/MatchContext";

export function useMatch() {
  const { match, owner } = useContext(MatchContext);

  return { match, owner };
}