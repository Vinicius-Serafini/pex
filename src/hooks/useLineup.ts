import { useEffect, useState } from "react";
import { isObjectEmpty } from "src/utils";
import { buildLineup, convertLineupToRawLineup, saveRawLineup } from "src/services/lineupService";
import { Lineup, LineupObject, PositionLabel, RawLineup, Team, User } from "src/types";

export default function useLineup(team: Team): LineupObject {

  const [_lineup, setLineup] = useState<Lineup>(buildLineup(team.lineup));
  const isLineupFull = (): boolean => _lineup.flat().filter(players => {
    if (!players) {
      return false;
    }

    return !isObjectEmpty(players.first);

  }).length >= 11;

  useEffect(() => {
    const rawLineup = convertLineupToRawLineup(_lineup);

    if (team.uid) {
      saveRawLineup(team.uid, rawLineup);
    }
  }, [_lineup])

  const lineup = {
    get() {
      return _lineup;
    },
    get isLineupFull() {
      return isLineupFull();
    },
    addPlayer(position: PositionLabel, player: User): boolean {
      if (isLineupFull()) {
        return false;
      }

      setLineup(_lineup.map(row => row.map(column => {
        if (!column) {
          return column;
        }

        if (column.position == position) {
          column.first = player;
        }

        return column;
      })));

      return true;
    },
    addSubstitutePlayer(position: PositionLabel, player: User) {
      setLineup(_lineup.map(row => row.map(column => {
        if (!column) {
          return column;
        }

        if (column.position == position && !isObjectEmpty(column.first)) {
          column.substitutes = [...column.substitutes, player];
        }


        return column;
      })));

      return true;
    },
    remove(player: User) {
      setLineup(_lineup.map(row => row.map(column => {
        if (!column) {
          return column;
        }

        // if (column.position == 'GOL') {
        //   column.first = {};
        // }

        // @ts-ignore: Unreachable code error
        if (column.first.uid == player.uid) {
          // @ts-ignore: Unreachable code error
          column.first = {};
        }

        column.substitutes = column.substitutes.filter(p => p.uid != player.uid);

        return column;
      })));

      return true;
    }
  }

  return lineup;
}