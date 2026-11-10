import { db } from "./firebaseConfig.js";
import { onAuthReady } from "./authentication.js";
import { collection, addDoc, serverTimestamp, doc } from "firebase/firestore";

let currentUser = null //user info placeholder

onAuthReady(function (user) {
    if (!user) {
        location.href = "index.html" //no user, they need to log in
    } else {
        currentUser = user;
    }
})

async function saveHike(event) {
    event.preventDefault();

    //1. collct the information of the hike and make a hike OBJECT
    const newHike = {
        name: document.getElementById("hikeNameInput").value,
        city: document.getElementById("cityInput").value,
        level: document.getElementById("levelInput").value,
        length: Number(document.getElementById("lengthInput").value),   // store a number, not "10.5"
        details: document.getElementById("detailsInput").value,
        owner: currentUser.uid,                                       // WHO added it
        ownerName: currentUser.displayName || currentUser.email,
        last_updated: serverTimestamp()                               // WHEN it was added
    }

    //2. save it to firestore
    try {
        await addDoc(collection(db, "hikes"), newHike);
        location.href = "main.html"
    } catch (error) {
        console.log("error writing the document", error);
    }


}
document.getElementById("addHikeForm").addEventListener("submit", saveHike);

