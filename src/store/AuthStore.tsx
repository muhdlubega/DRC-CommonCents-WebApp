import { onAuthStateChanged } from "firebase/auth";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { makeAutoObservable } from "mobx";
import { auth, db } from "../firebase";

export interface Alert {
  open: boolean;
  message: string;
  type: string;
}

export interface User {
  displayName: string | null | undefined;
  email: string | null | undefined;
  photoURL: string | null | undefined;
}

class AuthStore {
  currency: string = "INR";
  symbol: string = "₹";
  alert: Alert = {
    open: false,
    message: "",
    type: "success",
  };
  user: User | null = null;
  loading: boolean = false;
  balance: number | null | undefined = null;
  leaderboard: User[] = [];
  firestore = getFirestore();
  
  // citiesRef = collection(this.firestore, "users");
  usersRef = collection(this.firestore, "users");
  docs = getDocs(collection(this.firestore, "users"));

  constructor() {
    makeAutoObservable(this);
    
    this.initializeUser();
    
    onAuthStateChanged(auth, (user) => {
      if (user) this.setUser(user);
      else this.setUser(null);
    });
  }

  setCurrency(currency: string) {
    this.currency = currency;
    if (currency === "INR") this.symbol = "₹";
    else if (currency === "USD") this.symbol = "$";
  }

  setAlert(alert: Alert) {
    this.alert = alert;
    console.log(alert);
  }

  setUser(user: User | null) {
    this.user = user;
  }

  setLoading(loading: boolean) {
    this.loading = loading;
  }

  async initializeUser() {
    const querySnapshot = await getDocs(collection(db, "users"));
    querySnapshot.forEach((doc) => {
      if (auth.currentUser!.uid == doc.id) {
        this.balance = doc.data().balance || null;
        console.log(doc.id, " => ", doc.data().balance);
      }
    });
    // if (auth.currentUser) {
    //   this.setUser(auth.currentUser);
    //   const userSnapshot = await getDoc(doc(this.usersRef, auth.currentUser!.uid));
    //   if (userSnapshot.exists()) {
    //     const userData = userSnapshot.data();
    //     if (userData) {
    //       this.balance = this.currUser.balance || null ;
    //     }
    //   }
    // }
  }

  // async updateUser(user: User) {
  //   await setDoc(this.userDocRef, user);
  // }

  async setBalance(newBalance: number) {
    this.balance = parseFloat(newBalance.toFixed(2)); ;
    // await setDoc(this.userDocRef, { balance: newBalance });
    await setDoc(doc(db, "users", auth.currentUser!.uid), {
      balance: newBalance
    });
  }

  async setResetBalance(resetBalance: number) {
    this.balance = parseFloat(resetBalance.toFixed(2)); ;
    // await setDoc(this.userDocRef, { balance: resetBalance });
    await setDoc(doc(db, "users", auth.currentUser!.uid), {
      balance: resetBalance
    });
  }
}

const authStore = new AuthStore();

export default authStore;
