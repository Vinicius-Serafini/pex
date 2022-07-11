import { getApps, initializeApp } from 'firebase/app';
import { getAuth, signOut } from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID
};

let clientFirebase = getApps()[0];
if (!getApps().length) {
  clientFirebase = initializeApp(firebaseConfig);
}

const clientAuth = getAuth(clientFirebase);

const logOut = async () => await signOut(clientAuth);

export { clientAuth, clientFirebase, logOut };