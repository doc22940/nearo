import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

const prodConfig = {
  apiKey: "AIzaSyDaARZuHxu8oLnIxCHXUmAfwSSD9hiAvtY",
  authDomain: "locally-57510.firebaseapp.com",
  databaseURL: "https://locally-57510.firebaseio.com",
  projectId: "locally-57510",
  storageBucket: "locally-57510.appspot.com",
  messagingSenderId: "225376231981"
};

const devConfig = {
  apiKey: "AIzaSyDaARZuHxu8oLnIxCHXUmAfwSSD9hiAvtY",
  authDomain: "locally-57510.firebaseapp.com",
  databaseURL: "https://locally-57510.firebaseio.com",
  projectId: "locally-57510",
  storageBucket: "locally-57510.appspot.com",
  messagingSenderId: "225376231981"
};

const config = process.env.NODE_ENV === 'production'
  ? prodConfig
  : devConfig;

if (!firebase.apps.length) {
  firebase.initializeApp(config);
}

const auth = firebase.auth();
const db = firebase.firestore();
db.settings({timestampsInSnapshots: true});
const googleProvider = new firebase.auth.GoogleAuthProvider();
const fbProvider = new firebase.auth.FacebookAuthProvider();

export {
  auth,
  googleProvider,
  fbProvider,
  db
};