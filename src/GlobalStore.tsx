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
}

export default GlobalStore;
