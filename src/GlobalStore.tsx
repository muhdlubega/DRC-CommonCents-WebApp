import { doc, getFirestore, setDoc } from "firebase/firestore";
import { makeAutoObservable } from "mobx";

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

class GlobalStore {
  currency: string = "INR";
  symbol: string = "₹";
  alert: Alert = {
    open: false,
    message: "",
    type: "success",
  };
  user: User | null = null;
  loading: boolean = false;
  balance: number = 10000;
  firestore = getFirestore();
  balanceDocRef = doc(this.firestore, "balances", "user-1");

  constructor() {
    makeAutoObservable(this);
  }

  setCurrency(currency: string) {
    this.currency = currency;
    if (currency === "INR") this.symbol = "₹";
    else if (currency === "USD") this.symbol = "$";
  }

  setAlert(alert: Alert) {
    this.alert = alert;
  }

  setUser(user: User | null) {
    this.user = user;
  }

  setLoading(loading: boolean) {
    this.loading = loading;
  }

  async setBalance(newBalance: number) {
    this.balance = newBalance;
    await setDoc(this.balanceDocRef, { balance: newBalance });
  }
}

export default GlobalStore;
