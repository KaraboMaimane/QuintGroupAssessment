import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: 'AIzaSyBOztYQwN4L7xY-RLAuRrCb9r48mIev4BU',
    authDomain: 'quintgroupassesment.firebaseapp.com',
    projectId: 'quintgroupassesment',
    storageBucket: 'quintgroupassesment.appspot.com',
    messagingSenderId: '588245050196',
    appId: '1:588245050196:web:21427c4398829de593dec1',
    measurementId: 'G-95RL9JBECL'
}

// init firebase
initializeApp(firebaseConfig)

// init firestore service
const db = getFirestore()
export default db
