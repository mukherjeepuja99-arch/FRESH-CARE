import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import appletConfig from '../../firebase-applet-config.json';

// FreshCare Firebase Configuration loaded from provisioned applet config
export const firebaseConfig = {
  apiKey: appletConfig.apiKey || "AIzaSyC5dl9t4dr1qA_8IzMikvzZxM81p-nzds4",
  authDomain: appletConfig.authDomain || "peaceful-tomorrow-p15zq.firebaseapp.com",
  projectId: appletConfig.projectId || "peaceful-tomorrow-p15zq",
  storageBucket: appletConfig.storageBucket || "peaceful-tomorrow-p15zq.firebasestorage.app",
  messagingSenderId: appletConfig.messagingSenderId || "904800578130",
  appId: appletConfig.appId || "1:904800578130:web:d658ec2b858ffd7b464d8b"
};

// Initialize Firebase App instance safely
export const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Initialize Firebase Authentication
export const auth = getAuth(app);

// Initialize Cloud Firestore instance using databaseId if provided
const firestoreDbId = appletConfig.firestoreDatabaseId && appletConfig.firestoreDatabaseId !== '(default)'
  ? appletConfig.firestoreDatabaseId
  : undefined;

export const db = firestoreDbId ? getFirestore(app, firestoreDbId) : getFirestore(app);
export const databaseId = firestoreDbId || '(default)';
export const projectId = firebaseConfig.projectId;
