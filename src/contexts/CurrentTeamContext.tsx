import { createContext, ReactNode, useState } from "react";
import { useAuth } from "src/hooks/useAuth";
import useLineup from "src/hooks/useLineup";
import { Lineup, LineupObject, Team, TeamObject, User } from "src/types";

type CurrentTeamContextProps = {
  team: TeamObject;
  lineup?: LineupObject;
}

type CurrentTeamContextProviderProps = {
  current_team: Team;
  children: ReactNode;
}

export const CurrentTeamContext = createContext({} as CurrentTeamContextProps);

export function CurrentTeamContextProvider({ current_team, children }: CurrentTeamContextProviderProps) {
  const { user } = useAuth();
  const [_team, _setTeam] = useState<Team>(current_team);
  const lineup = useLineup(_team);
  // const lineup = useLineup(initial_lineup);

  const team = {
    get() {
      return _team;
    },
    removePlayer(player: User) {
      if (player.uid == (typeof _team.owner == "string" ? _team.owner : _team.owner.uid)) {
        throw Error('Cannot remove the team owner')
      }

      if (user?.uid != (typeof _team.owner == "string" ? _team.owner : _team.owner.uid)) {
        throw Error("Only the team's owner can remove players");
      }

      lineup.remove(player);

      _setTeam({
        ..._team,
        players: (Array.isArray(_team.players) && _team.players.length > 0 ? _team.players?.filter(p => p.uid != player.uid) : [])
      });
    }
  }

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