import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyAcRTyUJHxwerQVosAruWwzgNqubnleYJM",
    authDomain: "initize.firebaseapp.com",
    databaseURL: "https://initize.firebaseio.com",
    projectId: "initize",
    storageBucket: "initize.appspot.com",
    messagingSenderId: "35880949955",
    appId: "1:35880949955:web:981e9b47f71f0a26"
};

export default function fb(){
    console.log("Firebase config", firebaseConfig)
    firebase.initializeApp(firebaseConfig)
};


// Firebase product	                                Namespace	Web
// Authentication	                                firebase.auth()		
// Cloud Firestore	                                firebase.firestore()		
// Cloud Functions for Firebase Client SDK	        firebase.functions()		
// Cloud Messaging	                                firebase.messaging()		
// Cloud Storage	                                firebase.storage()		
// Performance Monitoring(beta release)	            firebase.performance()		
// Realtime Database	                            firebase.database()		




// Firebase product	                                Library reference
// Firebase core (required)	                        import "firebase/app";
// Authentication	                                import "firebase/auth";
// Cloud Firestore	                                import "firebase/firestore";
// Cloud Functions for Firebase Client SDK	        import "firebase/functions";
// Cloud Messaging	                                import "firebase/messaging";
// Cloud Storage	                                import "firebase/storage";
// Performance Monitoring(beta release)	            import "firebase/performance";
// Realtime Database	                            import "firebase/database";