import { createContext, ReactNode, useState } from "react";
import useLineup from "src/hooks/useLineup";
import { Lineup, LineupObject, Team } from "src/types";

type CurrentTeamContextProps = {
  team: Team;
  lineup?: LineupObject;
}

type CurrentTeamContextProviderProps = {
  current_team: Team;
  children: ReactNode;
}

export const CurrentTeamContext = createContext({} as CurrentTeamContextProps);

export function CurrentTeamContextProvider({ current_team, children }: CurrentTeamContextProviderProps) {
  const [team, setTeam] = useState<Team>(current_team);
  const lineup = useLineup(team);
  // const lineup = useLineup(initial_lineup);


  return (
    <CurrentTeamContext.Provider value={{ team, lineup }}>
      {children}
    </CurrentTeamContext.Provider>
  );

}


// const initial_lineup = {
//   'ATC-E': {
//     first: { "uid": "MlGA2JgGOMRYlpIigLmwtIfb5r22", "avatar": "https://lh3.googleusercontent.com/a/AATXAJyk1DRjSuozL55xVp2De328UvtrppQVV4cFYOMrdg=s96-c", "name": "Vini Serafini", "mail": "sr.viniciusserafini@gmail.com" },
//     substitutes: []
//   },
//   'ATC-D': {
//     first: { "uid": "MlGA2JgGOMRYlpIigLmwtIfb5r22", "avatar": "https://lh3.googleusercontent.com/a/AATXAJyk1DRjSuozL55xVp2De328UvtrppQVV4cFYOMrdg=s96-c", "name": "Vini Serafini", "mail": "sr.viniciusserafini@gmail.com" },
//     substitutes: []
//   },
//   'MLA-E': {
//     first: { "uid": "MlGA2JgGOMRYlpIigLmwtIfb5r22", "avatar": "https://lh3.googleusercontent.com/a/AATXAJyk1DRjSuozL55xVp2De328UvtrppQVV4cFYOMrdg=s96-c", "name": "Vini Serafini", "mail": "sr.viniciusserafini@gmail.com" },
//     substitutes: []
//   },
//   'MEC-E': {
//     first: { "uid": "MlGA2JgGOMRYlpIigLmwtIfb5r22", "avatar": "https://lh3.googleusercontent.com/a/AATXAJyk1DRjSuozL55xVp2De328UvtrppQVV4cFYOMrdg=s96-c", "name": "Vini Serafini", "mail": "sr.viniciusserafini@gmail.com" },
//     substitutes: []
//   },
//   'MEC-D': {
//     first: { "uid": "MlGA2JgGOMRYlpIigLmwtIfb5r22", "avatar": "https://lh3.googleusercontent.com/a/AATXAJyk1DRjSuozL55xVp2De328UvtrppQVV4cFYOMrdg=s96-c", "name": "Vini Serafini", "mail": "sr.viniciusserafini@gmail.com" },
//     substitutes: []
//   },
//   'MLA-D': {
//     first: { "uid": "MlGA2JgGOMRYlpIigLmwtIfb5r22", "avatar": "https://lh3.googleusercontent.com/a/AATXAJyk1DRjSuozL55xVp2De328UvtrppQVV4cFYOMrdg=s96-c", "name": "Vini Serafini", "mail": "sr.viniciusserafini@gmail.com" },
//     substitutes: []
//   },
//   'LAT-E': {
//     first: { "uid": "MlGA2JgGOMRYlpIigLmwtIfb5r22", "avatar": "https://lh3.googleusercontent.com/a/AATXAJyk1DRjSuozL55xVp2De328UvtrppQVV4cFYOMrdg=s96-c", "name": "Vini Serafini", "mail": "sr.viniciusserafini@gmail.com" },
//     substitutes: []
//   },
//   'ZAG-E': {
//     first: { "uid": "MlGA2JgGOMRYlpIigLmwtIfb5r22", "avatar": "https://lh3.googleusercontent.com/a/AATXAJyk1DRjSuozL55xVp2De328UvtrppQVV4cFYOMrdg=s96-c", "name": "Vini Serafini", "mail": "sr.viniciusserafini@gmail.com" },
//     substitutes: []
//   },
//   'ZAG-D': {
//     first: { "uid": "MlGA2JgGOMRYlpIigLmwtIfb5r22", "avatar": "https://lh3.googleusercontent.com/a/AATXAJyk1DRjSuozL55xVp2De328UvtrppQVV4cFYOMrdg=s96-c", "name": "Vini Serafini", "mail": "sr.viniciusserafini@gmail.com" },
//     substitutes: []
//   },
//   'LAT-D': {
//     first: { "uid": "MlGA2JgGOMRYlpIigLmwtIfb5r22", "avatar": "https://lh3.googleusercontent.com/a/AATXAJyk1DRjSuozL55xVp2De328UvtrppQVV4cFYOMrdg=s96-c", "name": "Vini Serafini", "mail": "sr.viniciusserafini@gmail.com" },
//     substitutes: []
//   },
//   GOL: {
//     first: { "uid": "MlGA2JgGOMRYlpIigLmwtIfb5r22", "avatar": "https://lh3.googleusercontent.com/a/AATXAJyk1DRjSuozL55xVp2De328UvtrppQVV4cFYOMrdg=s96-c", "name": "Vini Serafini", "mail": "sr.viniciusserafini@gmail.com" },
//     substitutes: []
//   }
// }