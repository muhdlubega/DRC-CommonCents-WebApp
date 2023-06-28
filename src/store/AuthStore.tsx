import { onAuthStateChanged } from "firebase/auth";
import {
  collection,
  doc,
  getDocs,
  getFirestore,
  setDoc,
  updateDoc
} from "firebase/firestore";
import { makeObservable, observable, runInAction } from "mobx";
import { auth, db } from "../firebase";

export interface Alert {
  open: boolean;
  message: string;
  type: string;
}

export interface User {
  displayName: string | null | undefined;
  email: string | null | undefined;
  photoURL?: string | null | undefined;
  balance?: number | null | undefined;
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
  balance: number | null | undefined = this.user?.balance;
  photoURL: string | null | undefined = this.user?.photoURL;
  displayName: string | null | undefined = this.user?.displayName;
  email: string | null | undefined = this.user?.email;
  leaderboard: User[] = [];
  firestore = getFirestore();
  // citiesRef = collection(this.firestore, "users");
  usersRef = collection(this.firestore, "users");
  docs = getDocs(collection(this.firestore, "users"));

  constructor() {
    makeObservable(this,{
      currency: observable,
      symbol: observable,
      alert: observable,
      user: observable,
      loading: observable,
      balance: observable,
      photoURL: observable,
      displayName: observable,
      email: observable,
      leaderboard: observable,
      firestore: observable,
      usersRef: observable,
      docs: observable
    });
    
    this.initializeLeaderboard();
    
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
    runInAction(() => {
    this.user = user;
    })
  }

  setLoading(loading: boolean) {
    this.loading = loading;
  }

  async initializeLeaderboard() {
      const querySnapshot = await getDocs(collection(db, "users"));
      runInAction(() => {
      const leaderboardData: User[] = [];
      querySnapshot.forEach((doc) => {
        const { balance, displayName, email } = doc.data();
        leaderboardData.push({ displayName, email, balance });
        if (auth.currentUser && auth.currentUser.uid === doc.id) {
          this.balance = balance || null;
        }
      });
      
        this.leaderboard = leaderboardData.sort((a, b) => (b.balance as number) - (a.balance as number));
    })
    }
  // async initializeUser() {
    
  //   const querySnapshot = await getDocs(collection(db, "users"));
  //   runInAction(() => {
  //   querySnapshot.forEach((doc) => {
  //     if (auth.currentUser!.uid == doc.id) {
  //       this.balance = doc.data().balance || null;
  //       this.displayName = doc.data().displayName || null;
  //       this.email = doc.data().email || null;
  //       console.log(doc.id, " => ", doc.data().balance);
  //     }
  //   });})
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
  // }

  // async updateUser(user: User) {
  //   await setDoc(this.userDocRef, user);
  // }

  async initializeUser(balance: number, displayName: string, email: string, photoURL: string) {
    this.balance = parseFloat(balance.toFixed(2));
    this.displayName = displayName;
    this.email = email;
    this.photoURL = photoURL;
    // await setDoc(this.userDocRef, { balance: newBalance });
    await setDoc(doc(db, "users", auth.currentUser!.uid), {
      balance: balance,
      displayName: displayName,
      email: email,
      photoURL: photoURL
    });
  }


  async setBalance(newBalance: number) {
    runInAction(() => {
    this.balance = parseFloat(newBalance.toFixed(2)); })
    // await setDoc(this.userDocRef, { balance: newBalance });
    await updateDoc(doc(db, "users", auth.currentUser!.uid), {
      balance: newBalance
    });
  }

  async setResetBalance(resetBalance: number) {
    runInAction(() => {
    this.balance = parseFloat(resetBalance.toFixed(2)); })
    // await setDoc(this.userDocRef, { balance: resetBalance });
    await updateDoc(doc(db, "users", auth.currentUser!.uid), {
      balance: resetBalance
    });
  }
}

const authStore = new AuthStore();

export default authStore;
