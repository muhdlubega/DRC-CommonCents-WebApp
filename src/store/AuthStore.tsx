import { onAuthStateChanged } from "firebase/auth";
import {
  doc,
  getDoc,
  getFirestore,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { makeAutoObservable } from "mobx";
import { auth } from "../firebase";

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
  balance: number | null = null;
  leaderboard: User[] = [];
  firestore = getFirestore();
  userDocRef = doc(this.firestore, "users", "user-1");

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
    const userSnapshot = await getDoc(this.userDocRef);
    if (userSnapshot.exists()) {
      const userData = userSnapshot.data();
      if (userData) {
        this.balance = userData.balance || null;
      }
    }
  }

  async updateUser(user: User) {
    await setDoc(this.userDocRef, user);
  }

  async setBalance(newBalance: number) {
    this.balance = parseFloat(newBalance.toFixed(2)); ;
    await updateDoc(this.userDocRef, { balance: newBalance });
  }

  async setResetBalance(resetBalance: number) {
    this.balance = parseFloat(resetBalance.toFixed(2)); ;
    await updateDoc(this.userDocRef, { balance: resetBalance });
  }
}

const authStore = new AuthStore();

export default authStore;
