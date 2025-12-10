import { ref, onDisconnect, set, onValue } from "firebase/database";
import { doc, setDoc, updateDoc } from "firebase/firestore";
import { auth, db as firestoreDB } from "./firebaseConfig";
import { rtdb as realtimeDB } from "./firebaseConfig";

export function setupPresence() {
  const user = auth.currentUser;
  if (!user) return;

  const uid = user.uid;
  const statusRef = ref(realtimeDB, `/status/${uid}`);

  const onlineStatus = {
    state: "online",
    last_changed: Date.now(),
  };

  const offlineStatus = {
    state: "offline",
    last_changed: Date.now(),
  };

  // Set online immediately when connected
  set(statusRef, onlineStatus);

  // Set offline on disconnect
  onDisconnect(statusRef).set(offlineStatus);

  // Watch realtime presence → mirror to Firestore
  onValue(statusRef, async (snapshot) => {
  const userNow = auth.currentUser;
  if (!userNow) return;

  const data = snapshot.val();  

  await updateDoc(doc(firestoreDB, "users", uid), {
    status: data,  
  });
});
}
