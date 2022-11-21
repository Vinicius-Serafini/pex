import { DocumentData } from "firebase-admin/firestore";
import { addDoc, collection, doc, getDoc, setDoc, Timestamp, updateDoc } from "firebase/firestore";
import { Invite, InviteStatus, Match, Team, User } from "src/types";
import { addDays, isObjectEmpty } from "src/utils";
import { clientFirestore } from "./firebaseClient";
import { setInivitedTeam } from "./matchService";
import { addPlayer } from "./teamService";

const _generateInvite = async (model: 'teams' | 'matches', id: string): Promise<string> => {
  const inviteRef = await addDoc(collection(clientFirestore, model, id, 'invites'), {
    created_at: Timestamp.now(),
    expires_at: Timestamp.fromDate(addDays(new Date(), 10)),
    status: "PENDING"
  });

  return inviteRef.id;
}


const _getInvite = async (model: 'teams' | 'matches', teamId: string, inviteId: string): Promise<Invite | null> => {
  const inviteRef = doc(clientFirestore, model, teamId, 'invites', inviteId);

  const inviteSnap = await getDoc(inviteRef);

  if (!inviteSnap.exists()) {
    return null;
  }

  const data = inviteSnap.data();

  return {
    uid: inviteSnap.id,
    created_at: data.created_at.toDate(),
    expires_at: data.expires_at.toDate(),
    status: data.status
  } as Invite
}

export const getTeamInvite = async (teamId: string, inviteId: string): Promise<Invite | null> => {
  return await _getInvite('teams', teamId, inviteId);
}

export const getMatchInvite = async (matchId: string, inviteId: string): Promise<Invite | null> => {
  return await _getInvite('matches', matchId, inviteId);
}

export const isInviteValid = (invite: Invite): boolean => {
  if (!invite || isObjectEmpty(invite)) {
    return false;
  }

  const now = new Date();

  if (invite.status != "PENDING") {
    return false;
  }

  return new Date(invite.expires_at) > now;
}

const _updateInvite = async (
  model: 'teams' | 'matches',
  id: string,
  invite: Invite,
  status: InviteStatus,
  entity: DocumentData
) => {

  const inviteRef = doc(clientFirestore, model, id, 'invites', invite.uid);

  await updateDoc(inviteRef, {
    updated_at: Timestamp.now(),
    status,
    updated_by: entity
  });

  return inviteRef.id;
}

export const generateTeamInvite = async (teamId: string): Promise<string> => {
  return await _generateInvite('teams', teamId);
}

export const generateMatchInvite = async (matchId: string): Promise<string> => {
  return await _generateInvite('matches', matchId);
}

export const updateTeamInvite = async (team: Team, invite: Invite, status: InviteStatus, user: User): Promise<string> => {
  // const inviteRef = await updateDoc(doc(clientFirestore, 'teams', team.uid as string, 'invites', invite.uid), {
  //   updated_at: Timestamp.now(),
  //   status,
  //   updated_by: doc(clientFirestore, `users/${user.uid}`)
  // });
  const userRef = doc(clientFirestore, `users/${user.uid}`)

  const inviteRef = await _updateInvite('teams', team.uid as string, invite, status, userRef)

  if (status == "ACCEPTED") {
    await addPlayer(team, user);
  }

  return inviteRef;
}

export const updateMatchInvite = async (match: Match, invite: Invite, status: InviteStatus, team: Team): Promise<string> => {
  const matchRef = doc(clientFirestore, `teams/${team.uid}`)

  const inviteRef = await _updateInvite('teams', match.uid as string, invite, status, matchRef)

  if (status == "ACCEPTED") {
    await setInivitedTeam(match, team);
  }

  return inviteRef;
}