import { User as FirebaseUser } from "firebase/auth";
import { collection, doc, DocumentData, DocumentReference, getDoc, setDoc } from "firebase/firestore"
import { User } from "src/types";
import { clientFirestore } from "./firebaseClient";

export const getUser = async (uid: string) => {
  const userRef = doc(clientFirestore, 'users', uid);
  const userSnap = await getDoc(userRef);

  if (!userSnap.exists()) {
    return null;
  }

  return userSnap.data() as User;
}


export const createUser = async (user: User): Promise<User | null> => {
  const userRef = await setDoc(doc(clientFirestore, 'users', user.uid), {
    ...user
  });

  return {
    ...user
  };
}

export const convertFirebaseUserToUser = (firebase_user: FirebaseUser): User => {
  const { displayName, photoURL, uid, email } = firebase_user;

  if (!displayName || !photoURL || !email) {
    throw new Error('Missing information from Google Account.');
  }

  return {
    uid,
    name: displayName,
    mail: email,
    avatar: photoURL
  };
}

export const getUserFromRef = async (userRef: DocumentReference<DocumentData>) => {
  const userSnap = await getDoc(userRef);

  if (!userSnap.exists()) {
    throw new Error("User doens't exists");
  }

  return userSnap.data() as User;
}