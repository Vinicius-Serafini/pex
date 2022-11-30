import { addDoc, collection, deleteDoc, doc, DocumentData, DocumentReference, Firestore, getDoc, getDocs, query, updateDoc, where } from "firebase/firestore";
import { Player, Team, User } from "src/types";
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
      uid: doc.id,
      name: team.name,
      owner: team.owner.id,
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
    uid: teamSnap.id,
    name: team.name,
    owner: team.owner.id,
    players: await getTeamPlayers(team.players),
    lineup: await getTeamRawLineup(teamSnap.id)
  };
}

export const getTeamShallow = async (uid: string): Promise<Team | null> => {
  const teamRef = doc(clientFirestore, 'teams', uid);
  const teamSnap = await getDoc(teamRef);

  if (!teamSnap.exists()) {
    return null;
  }

  const team = teamSnap.data();

  return {
    uid: teamSnap.id,
    name: team.name,
    owner: team.owner.id,
  };
}

export const addPlayer = async (team: Team, user: User) => {
  const teamRef = await updateDoc(doc(clientFirestore, 'teams', team.uid as string), {
    players: [
      ...team.players?.map((p: User) => doc(clientFirestore, `users/${p.uid}`)) as Array<DocumentReference>,
      doc(clientFirestore, `users/${user.uid}`)
    ]
  });

  return true;
}

export const removePlayer = async (team: Team, user: User) => {
  // const teamRef = await updateDoc(doc(clientFirestore, 'teams', team.uid as string), {
  //   players: [
  //     ...team.players?.filter((p: User) => p.uid != user.uid)
  //     .map((p: User) => doc(clientFirestore, `users/${p.uid}`)) as Array<DocumentReference>,
  //   ]
  // });

  const players = [
    ...team.players?.filter((p: User) => p.uid != user.uid)
      .map((p: User) => doc(clientFirestore, `users/${p.uid}`)) as Array<DocumentReference>,
  ]

  await updateTeam(team, { players })

  return true;
}


export const updateTeam = async (team: Team, data: any) => {
  const teamRef = await updateDoc(doc(clientFirestore, 'teams', team.uid as string), data);

  return true;
}