import {
  User as FirebaseUser,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  onIdTokenChanged,
  Unsubscribe,
  getIdToken
} from "firebase/auth";
import { createContext, ReactNode, useEffect, useState } from "react";
import { clientAuth } from "../services/firebaseClient";
import { User } from "../types";
import nookies from "nookies";
import { useRouter } from "next/router";


export type AuthContextType = {
  user: User | null | undefined;
  signInWithGoogle: () => Promise<void>;
}

type AuthContextProviderProps = {
  children: ReactNode;
}

export const AuthContext = createContext({} as AuthContextType);

export function AuthContextProvider(props: AuthContextProviderProps) {
  const [user, setUser] = useState<User | null>();
  const [unsubiscribe, setUnsubiscribe] = useState<Array<Unsubscribe>>([]);
  const router = useRouter();

  const setFirebaseUser = (user: FirebaseUser) => {

    const { displayName, photoURL, uid, email } = user as FirebaseUser;

    if (!displayName || !photoURL || !email) {
      throw new Error('Missing information from Google Account.');
    }

    setUser({
      id: uid,
      name: displayName,
      mail: email,
      avatar: photoURL
    });
  }

  useEffect(() => {
    setUnsubiscribe([
      ...unsubiscribe,
      onAuthStateChanged(clientAuth, user => {
        if (user) {
          return setFirebaseUser(user);
        }
        return setUser(null);
      }),
      onIdTokenChanged(clientAuth, async user => {
        if (!user) {
          setUser(null);
          nookies.set(undefined, 'nextauth.token', '', { path: '/' })
        } else {
          const token = await getIdToken(user);
          setFirebaseUser(user);
          nookies.set(undefined, 'nextauth.token', token, { path: '/' })
        }
      })
    ]);

    return () => {
      unsubiscribe.forEach(unsub => unsub());
    }
  }, []);

  async function signInWithGoogle() {
    try {
      const provider = new GoogleAuthProvider();
      const { user } = await signInWithPopup(clientAuth, provider);

      if (user) {
        setFirebaseUser(user);
      }
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <AuthContext.Provider value={{ user, signInWithGoogle }}>
      {props.children}
    </AuthContext.Provider>
  );
}