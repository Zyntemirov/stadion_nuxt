import firebase from 'firebase'

// uncomment the below if you use firestore DB instead of firebase DB
// require('firebase/firestore')

const config = {
  apiKey: 'AIzaSyBLbhhEdj_ppF5upLpFJyK2fx3yob5TVNU',
  authDomain: 'stadion-e9852.firebaseapp.com',
  databaseURL: 'https://stadion-e9852.firebaseio.com',
  projectId: 'stadion-e9852',
  storageBucket: 'stadion-e9852.appspot.com',
  messagingSenderId: '1039370008461',
};
const googleProvider = new firebase.auth.GoogleAuthProvider()

export default !firebase.apps.length ? firebase.initializeApp(config) : firebase.app()
export {googleProvider}
