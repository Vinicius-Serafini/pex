import { DocumentSnapshot, QueryDocumentSnapshot } from "firebase-admin/firestore";
import { addDoc, arrayUnion, collection, doc, DocumentData, getDoc, getDocs, Query, query, setDoc, Timestamp, updateDoc, where } from "firebase/firestore";
import { Goal, Match, Place, Team, User } from "src/types";
import { clientFirestore } from "./firebaseClient";
import { getRandomImage } from "./imageService";
import { getTeam, getTeams, getTeamShallow } from "./teamService";
import { getUser, getUserFromRef } from "./userService";

type createMatchProps = {
  owner: Team;
  name: string;
  date: string;
  time: string;
  duration: number;
  place: Place;
}

export async function createMatch({ owner, name, date, time, duration, place }: createMatchProps) {
  const matchDateTime = new Date(`${date}T${time}`);

  const matchBgUrl = await getRandomImage();

  const matchId = await saveMatch({ owner, name, date: matchDateTime, duration, place, imgUrl: matchBgUrl });

  return matchId;
}

type saveMatchArgs = {
  owner: Team;
  name: string;
  date: Date;
  duration: number;
  place: Place;
  imgUrl: string
}
export async function saveMatch({ owner, date, name, duration, place, imgUrl }: saveMatchArgs) {
  const matchRef = await addDoc(collection(clientFirestore, 'matches'), {
    owner: doc(clientFirestore, 'teams', owner.uid as string),
    name,
    date: Timestamp.fromDate(date),
    duration,
    place,
    imgUrl
  });

  return matchRef.id;
}


export const getMatch = async (uid: string): Promise<Match | null> => {
  const matchRef = doc(clientFirestore, 'matches', uid);
  const matchSnap = await getDoc(matchRef);

  if (!matchSnap.exists()) {
    return null;
  }

  const match = matchSnap.data();

  return await _getMatchFromDocumentData(match, matchRef.id);
}

const _getMatchFromDocumentData = async (match: DocumentData, id: string): Promise<Match | null> => {
  const confirmedPlayers = await Promise.all(
    match.confirmed ? match.confirmed.map(async (user: any) => {
      return {
        status: user.status,
        user: await getUserFromRef(user.user)
      }
    }) : []
  );

  const _match = {
    uid: id,
    name: match.name,
    date: match.date.toDate(),
    duration: match.duration,
    owner: await getTeam(match.owner.id) as Team,
    place: match.place,
    imgUrl: match.imgUrl,
    confirmed: confirmedPlayers,
  }

  if (match.invitedTeam) {
    // @ts-ignore: Unreachable code error
    _match.invitedTeam = await getTeam(match.invitedTeam.id)
  }

  return _match;
}


export const getMatchesByUser = async (user: User): Promise<Array<Match>> => {
  // pesquisar todos os times;
  const usersTeams = await getTeams(user.uid);

  const teamsRefs = usersTeams.map(team => doc(clientFirestore, 'teams', team.uid));
  // pesquisar todas as partidas atreladas a times;
  const matchesRef = collection(clientFirestore, 'matches');

  const q = query(matchesRef, where('owner', 'in', teamsRefs), where('date', '>=', Timestamp.now()));

  return await _getMatches(q);
}

export const getMatchesByTeam = async (team: Team): Promise<Array<Match>> => {
  const teamRef = doc(clientFirestore, 'teams', team.uid as string);

  const matchesRef = collection(clientFirestore, 'matches');

  const q = query(matchesRef, where('owner', '==', teamRef), where('date', '>=', Timestamp.now()));

  return await _getMatches(q);
}

export const getHistoryMatchesByTeam = async (team: Team): Promise<Array<Match>> => {
  const teamRef = doc(clientFirestore, 'teams', team.uid as string);

  const matchesRef = collection(clientFirestore, 'matches');

  const q = query(matchesRef, where('owner', '==', teamRef), where('date', '<', Timestamp.now()));

  return await _getMatches(q);
}

export const getHistoryMatchesByuser = async (user: User): Promise<Array<Match>> => {
  // pesquisar todos os times;
  const usersTeams = await getTeams(user.uid);

  const teamsRefs = usersTeams.map(team => doc(clientFirestore, 'teams', team.uid));
  // pesquisar todas as partidas atreladas a times;
  const matchesRef = collection(clientFirestore, 'matches');

  const q = query(matchesRef, where('owner', 'in', teamsRefs), where('date', '<', Timestamp.now()));

  return await _getMatches(q);
}

const _getMatches = async (query: Query<DocumentData>): Promise<Array<Match>> => {
  const querySnapshop = await getDocs(query);

  const matches = await Promise.all(
    querySnapshop.docs.map(async doc => {
      const match = doc.data();

      return await _getMatchFromDocumentData(match, doc.id);
    })
  );

  return matches.filter(match => match !== null) as Array<Match>;
}

const _updateMatchInvite = async (match: Match, user: User, status: "ACCEPTED" | "REJECTED") => {
  const matchRef = doc(clientFirestore, 'matches', match.uid as string);

  await updateDoc(matchRef, {
    confirmed: arrayUnion({
      user: doc(clientFirestore, `users/${user.uid}`),
      status,
    })
  });

  const _match = await getMatch(matchRef.id);

  return _match;
}

export const acceptMatch = async (match: Match, user: User) => {
  return await _updateMatchInvite(match, user, "ACCEPTED");
}

export const rejectMatch = async (match: Match, user: User) => {
  return await _updateMatchInvite(match, user, "REJECTED");
}

export const setInivitedTeam = async (match: Match, team: Team) => {
  const matchRef = doc(clientFirestore, 'matches', match.uid as string);

  await updateDoc(matchRef, {
    invitedTeam: doc(clientFirestore, `teams/${team.uid}`)
  });

  return await getMatch(matchRef.id);
}

export const createGoal = async (match: Match, user: User, team: Team) => {
  const goalRef = await addDoc(collection(clientFirestore, 'goals'), {
    user: doc(clientFirestore, 'users', user.uid as string),
    match: doc(clientFirestore, 'matches', match.uid as string),
    team: doc(clientFirestore, 'teams', team.uid as string)
  });

  return goalRef.id;
}

export const getGoal = async (goal_id: string) => {
  const goalRef = doc(clientFirestore, 'goals', goal_id as string);
  const goalSnap = await getDoc(goalRef);

  if (!goalSnap.exists()) {
    return null;
  }

  const _goal = goalSnap.data();

  return {
    uid: goalRef.id,
    user: await getUser(_goal.user.id),
    team: await getTeamShallow(_goal.team.id),
    match: _goal.match.id,
  }
}

export const getGoalsFromMatch = async (match: Match) => {
  const goalsRef = collection(clientFirestore, 'goals');
  const matchRef = doc(clientFirestore, 'matches', match.uid as string);

  const q = query(goalsRef, where('match', '==', matchRef));

  const querySnapshop = await getDocs(q);

  const goals = await Promise.all(
    querySnapshop.docs.map(async doc => {
      return await getGoal(doc.id);
    })
  );

  return goals as Array<Goal>;
}

export const getGoalsFromUser = async (user: User) => {
  const goalsRef = collection(clientFirestore, 'goals');
  const userRef = doc(clientFirestore, 'users', user.uid as string);

  const q = query(goalsRef, where('user', '==', userRef));

  const querySnapshop = await getDocs(q);

  const goals = await Promise.all(
    querySnapshop.docs.map(async doc => {
      return await getGoal(doc.id);
    })
  );

  return goals as Array<Goal>;
}