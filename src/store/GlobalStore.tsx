import { doc, getDoc, getFirestore, setDoc } from "firebase/firestore";
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
  balance: number | null = null;
  duration: number = 5;
  payout: number = 100;
  previousSpot: number | null = null;
  currentSpot: number | null = null;
  data: any = null;
  basis: string = "stake";
  proposalTicks: number = 0;
  isDurationEnded: boolean = false;
  firestore = getFirestore();
  balanceDocRef = doc(this.firestore, "balances", "user-1");

  constructor() {
    makeAutoObservable(this);
    this.initializeBalance();
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

  setDuration(duration: number) {
    this.duration = duration;
  }

  setPayout(payout: number) {
    this.payout = payout;
  }

  setBasis(basis: string) {
    this.basis = basis;
  }

  setPreviousSpot(previousSpot: number) {
    this.previousSpot = previousSpot;
  }

  setCurrentSpot(currentSpot: number) {
    this.currentSpot = currentSpot;
  }
  
  setProposalTicks(proposalTicks: number) {
    this.proposalTicks = proposalTicks;
  }

  setIsDurationEnded(isDurationEnded: boolean) {
    this.isDurationEnded = isDurationEnded;
  }

  setData(data: any) {
    this.duration = parseInt(data.duration, 10);
    this.payout = parseInt(data.display_value, 10);
    this.basis = data.basis;
    this.previousSpot = parseFloat(data.spot);
    this.currentSpot = parseFloat(data.spot);
    this.proposalTicks = parseInt(data.duration, 10);
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

export default GlobalStore;
