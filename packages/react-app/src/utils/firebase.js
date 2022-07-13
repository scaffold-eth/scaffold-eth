import env from "../env";
import firebase from "firebase";
// Required for side-effects
require("firebase/functions");

if (!firebase.apps.length) {
  firebase.initializeApp(env.firebase);
}

export const functions = firebase.functions();
export const db = firebase.firestore();
