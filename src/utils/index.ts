import { DocumentData, getDocs, Query } from "firebase/firestore";
import { useAuth } from "src/hooks/useAuth";
import { clientFirestore } from "src/services/firebaseClient";
import { Team, User } from "src/types";

export const isObjectEmpty = (obj: Object): boolean => {
  return Object.keys(obj).length == 0;
}

export const changeGoogleAvatarSize = (src: string, size?: number): string => {
  if (!size) {
    return src.replace(/(=?s[0-9]+-c\b)/, "");
  }

  return src.replace(/=?s[0-9]+-c\b/, `s${size}-c`);
}

export const eagerLoadFirestoreDocs = async (query: Query<DocumentData>) => {
  const data: Array<any> = []

  const dataSnapshop = await getDocs(query);

  dataSnapshop.forEach(doc => {
    data.push(doc.data())
  });

  return data;
}

export const isCurrentUserTheTeamOwner = (team: Team, user: User | null): boolean => {

  if (!user) {
    return false;
  }

  return user.uid == team.owner.uid;
}