// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
  collection,
  doc,
  DocumentData,
  getDoc,
  getDocs,
  getFirestore,
  query,
} from "firebase/firestore";
import { useCallback, useEffect, useState } from "react";
import { getAuth, signInAnonymously } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCVB2mRNk-Rjdvc3z8jpXl3Wus6kQ0Ewcc",
  authDomain: "world-of-intellectual-property.firebaseapp.com",
  projectId: "world-of-intellectual-property",
  storageBucket: "world-of-intellectual-property.appspot.com",
  messagingSenderId: "206251839987",
  appId: "1:206251839987:web:bc66bdb41dab85f5408286",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth();

if (typeof window !== "undefined") {
  signInAnonymously(auth);
}

export function useFirestore() {
  return db;
}

export interface AsyncResult<T> {
  data?: T;
  error?: string;
  loading: boolean;
  refetch: () => void;
}

export interface FirestoreData extends DocumentData {
  id: string;
}

export function useFirestoreDocument(collection: string, docId: string) {
  const db = useFirestore();
  const [version, setVersion] = useState(0);
  const refetch = useCallback(() => setVersion(version + 1), [version]);
  const [result, setResult] = useState<AsyncResult<FirestoreData>>({
    refetch,
    loading: true,
  });

  useEffect(() => {
    if (!docId) return;

    setResult({ refetch, loading: true });

    console.log("GET", docId, collection, db);
    getDoc(doc(db, collection, docId)).then((snapshot) => {
      if (snapshot.exists()) {
        setResult({
          refetch,
          data: { ...snapshot.data(), id: snapshot.id },
          loading: false,
        });
      } else {
        setResult({
          refetch,
          loading: false,
          error: "not found",
        });
      }
    });
  }, [db, collection, docId, refetch]);

  return result;
}

export function useFirestoreCollection(collectionName: string) {
  const db = useFirestore();
  const [version, setVersion] = useState(0);
  const refetch = useCallback(() => setVersion(version + 1), [version]);
  const [result, setResult] = useState<AsyncResult<FirestoreData[]>>({
    refetch,
    loading: true,
  });

  useEffect(() => {
    setResult({ refetch, loading: true });

    getDocs(query(collection(db, collectionName))).then(
      (snapshot) => {
        const res: FirestoreData[] = [];
        snapshot.forEach((s) => res.push({ ...s.data(), id: s.id }));

        setResult({
          data: res,
          refetch,
          loading: false,
        });
      },
      (err) => setResult({ refetch, loading: false, error: err.toString() })
    );
  }, [db, collectionName, refetch]);

  return result;
}
