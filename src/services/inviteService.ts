import { addDoc, collection, doc, getDoc, setDoc, Timestamp, updateDoc } from "firebase/firestore";
import { Invite, InviteStatus, Team, User } from "src/types";
import { addDays } from "src/utils";
import { clientFirestore } from "./firebaseClient";
import { addPlayer } from "./teamService";

export const generateInvite = async (teamId: string): Promise<string> => {
  const inviteRef = await addDoc(collection(clientFirestore, 'teams', teamId, 'invites'), {
    created_at: Timestamp.now(),
    expires_at: Timestamp.fromDate(addDays(new Date(), 10)),
    status: "PENDING"
  });

  return inviteRef.id;
}


export const getInvite = async (teamId: string, invideId: string): Promise<Invite | null> => {
  const inviteRef = doc(clientFirestore, 'teams', teamId, 'invites', invideId);

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

export const isInviteValid = (invite: Invite): boolean => {
  const now = new Date();

  if (invite.status != "PENDING") {
    return false;
  }

  return new Date(invite.expires_at) > now;
}

export const updateInvite = async (team: Team, invite: Invite, status: InviteStatus, user: User) => {
  const inviteRef = await updateDoc(doc(clientFirestore, 'teams', team.uid as string, 'invites', invite.uid), {
    updated_at: Timestamp.now(),
    status,
    updated_by: doc(clientFirestore, `users/${user.uid}`)
  });

  if (status == "ACCEPTED") {
    await addPlayer(team, user);
  }

  return true;
}