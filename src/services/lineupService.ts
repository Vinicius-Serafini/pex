import { addDoc, collection, doc, getDocs, setDoc } from "firebase/firestore";
import { LINEUP } from "src/constants/lineups";
import { Lineup, Player, RawLineup } from "src/types";
import { isObjectEmpty } from "src/utils";
import { clientFirestore } from "./firebaseClient";
import { getUserFromRef } from "./userService";

export function buildLineup(initial_lineup: RawLineup | undefined): Lineup {

  const lineup = LINEUP.map(row => row.map(column => {
    if (!column) {
      return null;
    }

    // @ts-ignore: Unreachable code error
    const players = initial_lineup?.[column.position];

    if (!players) {
      return { ...column };
    }

    return {
      ...column,
      ...players
    };

  }));

  return lineup;
}

export const getTeamRawLineup = async (teamId: string) => {

  const lineupsRef = collection(clientFirestore, 'teams', teamId, 'lineups');

  const querySnapshop = await getDocs(lineupsRef);

  // @ts-ignore: Unreachable code error
  const rawLineup = await Object.entries(querySnapshop.docs[0]?.data()).reduce(async (acc, [key, values]) => {
    // @ts-ignore: Unreachable code error
    const body = await acc;

    // @ts-ignore: Unreachable code error
    body[key] = {
      first: values.first ? await getUserFromRef(values.first) : {},
      ...(values.substitutes?.length > 0 ?
        {
          substitutes: await Promise.all(
            values.substitutes.map(
              // @ts-ignore: Unreachable code error
              async player => await getUserFromRef(player)
            )
          )
        }
        : [])
    }

    return body;
  }, Promise.resolve({}));

  return rawLineup;
}

export const saveRawLineup = async (teamId: string, rawLineup: RawLineup) => {
  // @ts-ignore: Unreachable code error
  const _rawLineup = Object.entries(rawLineup).reduce((acc, [key, values]) => {
    // @ts-ignore: Unreachable code error
    const body = { ...acc };

    if (!isObjectEmpty(values.first)) {
      // @ts-ignore: Unreachable code error
      body[key] = {
        // @ts-ignore: Unreachable code error
        first: doc(clientFirestore, `users/${values.first.uid}`),
        ...(values.substitutes?.length > 0 ?
          { substitutes: values.substitutes.map(user => doc(clientFirestore, `users/${user.uid}`)) }
          : {}
        )
      }
    }
    return body;
  }, {});

  const lineupsRef = collection(clientFirestore, 'teams', teamId, 'lineups');

  const querySnapshop = await getDocs(lineupsRef);

  const lineupId = querySnapshop.docs?.[0].id;

  if (!lineupId) {
    const newLineupId = await addDoc(lineupsRef, _rawLineup);

    return newLineupId;
  } else {
    await setDoc(doc(clientFirestore, 'teams', teamId, 'lineups', lineupId), _rawLineup)
  }

  return lineupId;
}

export const convertLineupToRawLineup = (lineup: Lineup): RawLineup => {
  const rawLineup = lineup.flat().filter(position => {
    if (!position) {
      return false;
    }

    if (isObjectEmpty(position.first)) {
      return false;
    }

    return true;
  }).reduce((acc, position) => {
    const body = { ...acc };

    // @ts-ignore: Unreachable code error
    body[position.position] = {
      // @ts-ignore: Unreachable code error
      first: position.first,
      // @ts-ignore: Unreachable code error
      ...(position.substitutes?.length > 0 ? { substitutes: position.substitutes } : {})
    }

    return body;
  }, {})


  return rawLineup;
}