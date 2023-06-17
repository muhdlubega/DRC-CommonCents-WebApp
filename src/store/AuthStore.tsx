import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, getFirestore, setDoc } from "firebase/firestore";
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
  firestore = getFirestore();
  balanceDocRef = doc(this.firestore, "balances", "user-1");

  constructor() {
    makeAutoObservable(this);
    this.initializeBalance();

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

  async initializeBalance() {
    const balanceSnapshot = await getDoc(this.balanceDocRef);
    if (balanceSnapshot.exists()) {
      const balanceData = balanceSnapshot.data();
      if (balanceData && typeof balanceData.balance === "number") {
        this.balance = balanceData.balance;
      }
    }
  }

  async setBalance(newBalance: number) {
    this.balance = newBalance;
    await setDoc(this.balanceDocRef, { balance: newBalance });
  }
}

const authStore = new AuthStore;

export default authStore;
