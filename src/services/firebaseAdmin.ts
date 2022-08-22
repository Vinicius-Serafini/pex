import { initializeApp, ServiceAccount, getApps } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth'
import { credential } from "firebase-admin"
import serviceAccount from "firebase.json";
import { getFirestore } from "firebase-admin/firestore";

const firebaseConfig = {
  credential: credential.cert(serviceAccount as ServiceAccount),
};

let adminFirebase = getApps()[0];
if (!getApps().length) {
  adminFirebase = initializeApp(firebaseConfig);
}

const adminAuth = getAuth(adminFirebase);
const adminFirestore = getFirestore(adminFirebase);

export { adminAuth, adminFirebase, adminFirestore };

