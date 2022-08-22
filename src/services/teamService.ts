import { addDoc, collection, deleteDoc, doc, DocumentData, DocumentReference, Firestore, getDoc, getDocs, query, where } from "firebase/firestore";
import { Player, Team } from "src/types";
import { eagerLoadFirestoreDocs } from "src/utils";
import { clientFirestore } from "./firebaseClient";
import { getTeamRawLineup } from "./lineupService";
import { getUser, getUserFromRef } from "./userService";

export const createTeam = async (name: string, owner_id: string): Promise<string> => {
  const teamRef = await addDoc(collection(clientFirestore, 'teams'), {
    name,
    owner: doc(clientFirestore, `users/${owner_id}`),
    players: [doc(clientFirestore, `users/${owner_id}`)]
  });

  return teamRef.id;
}

export const getTeams = async (user_id: string) => {
  const teamsRef = collection(clientFirestore, 'teams');

  const q = query(teamsRef, where('players', 'array-contains', doc(clientFirestore, 'users', user_id)));
  const querySnapshop = await getDocs(q);

  const teams = Promise.all(querySnapshop.docs.map(async doc => {
    const team = doc.data();
    return {
      uid: team.uid,
      name: team.name,
      owner: await getUserFromRef(team.owner),
      players: await getTeamPlayers(team.players),
    };
  }));

  return teams;
}

export const getTeamPlayers = async (players: Array<DocumentData>) => {

  const users_id = players.map((doc): string => doc.path.replace("users/", "").trim());

  const usersRef = collection(clientFirestore, 'users');
  const q = query(usersRef, where('uid', 'in', users_id));

  const data = await eagerLoadFirestoreDocs(q);

  return data;
}

export const getTeam = async (uid: string): Promise<Team | null> => {
  const teamRef = doc(clientFirestore, 'teams', uid);
  const teamSnap = await getDoc(teamRef);

  if (!teamSnap.exists()) {
    return null;
  }

  const team = teamSnap.data();

  return {
    uid: team.uid,
    name: team.name,
    owner: await getUserFromRef(team.owner),
    players: await getTeamPlayers(team.players),
    lineup: await getTeamRawLineup(team.uid)
  };
}