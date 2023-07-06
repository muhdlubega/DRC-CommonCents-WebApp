import { GoogleAuthProvider, createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import {
  collection,
  doc,
  getDocs,
  getFirestore,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { action, makeObservable, observable } from "mobx";
import { auth, db } from "../firebase";

const googleProvider = new GoogleAuthProvider();

export interface Alert {
  open: boolean;
  message: string;
  type: string;
}

export interface User {
  displayName?: string | null | undefined;
  email?: string | null | undefined;
  photoURL?: string | null | undefined;
  balance?: number | null | undefined;
}

class AuthStore {
  currency: string = "USD";
  symbol: string = "$";
  alert: Alert = {
    open: false,
    message: "",
    type: "success",
  };
  user: User | null = null;
  loading: boolean = false;
  open: boolean = false;
  email: string = "";
  password: string = "";
  confirmPassword: string = "";
  // balance: number | null | undefined = this.user?.balance;
  // photoURL: string | null | undefined = this.user?.photoURL;
  // displayName: string | null | undefined = this.user?.displayName;
  // email: string | null | undefined = this.user?.email;
  leaderboard: User[] = [];
  firestore = getFirestore();
  // citiesRef = collection(this.firestore, "users");
  usersRef = collection(this.firestore, "users");
  docs = getDocs(collection(this.firestore, "users"));

  constructor() {
    makeObservable(this, {
      currency: observable,
      symbol: observable,
      alert: observable,
      user: observable,
      loading: observable,
      open: observable,
      email: observable,
      password: observable,
      confirmPassword: observable,
      // balance: observable,
      // photoURL: observable,
      // displayName: observable,
      // email: observable,
      leaderboard: observable,
      firestore: observable,
      usersRef: observable,
      docs: observable,
      signInWithGoogle: action,
      handleClose: action,
      handleOpen: action,
      handleSignUp: action,
      setEmail: action.bound,
      setPassword: action.bound,
      setConfirmPassword: action.bound,
      setCurrency: action.bound,
      setAlert: action.bound,
      setUser: action.bound,
      setLoading: action.bound,
      setOpen: action.bound,
      initializeLeaderboard: action.bound,
      initializeUser: action.bound,
      setBalance: action.bound,
      setResetBalance: action.bound,
      setUpdateName: action.bound,
    });

    this.initializeLeaderboard();

    onAuthStateChanged(auth, (user) => {
      if (user) this.setUser(user);
      else this.setUser(null);
    });
  }

  handleSignUp = async () => {
    if (this.password !== this.confirmPassword) {
      authStore.setAlert({
        open: true,
        message: "Passwords do not match",
        type: "error",
      });
      return;
    }

    try {
      const result = await createUserWithEmailAndPassword(auth, this.email, this.password);
      authStore.initializeUser(100000, this.email.replace(/\@.*/,''), this.email, '')
      authStore.setAlert({
        open: true,
        message: `Sign Up Successful. Welcome ${result.user.email}`,
        type: "success",
      });

      this.handleClose();
    } catch (error: any) {
      authStore.setAlert({
        open: true,
        message: error.message,
        type: "error",
      });
      return;
    }
  };

  handleLogin = async () => {
    if (!this.email || !this.password) {
      authStore.setAlert({
        open: true,
        message: "Please fill all the Fields",
        type: "error",
      });
      return;
    }

    try {
      const result = await signInWithEmailAndPassword(auth, this.email, this.password);
      authStore.setAlert({
        open: true,
        message: `Sign Up Successful. Welcome ${result.user.email}`,
        type: "success",
      });
      console.log(alert);

      this.handleClose();
    } catch (error: any) {
      authStore.setAlert({
        open: true,
        message: error.message,
        type: "error",
      });
      return;
    }
  };

  setEmail(email: string){
    this.email = email;
  }

  setPassword(password: string){
    this.password = password;
  }

  setConfirmPassword(confirmPassword: string){
    this.confirmPassword = confirmPassword;
  }

  signInWithGoogle = () => {
    signInWithPopup(auth, googleProvider)
      .then((res) => {
        
        this.setAlert({
          open: true,
          message: `Sign Up Successful. Welcome ${res.user.email}`,
          type: "success",
        });
        
        if(!this.user){
          this.initializeUser(100000, res.user.displayName as string, res.user.email as string, res.user.photoURL as string)
        } 
        else if (this.user) {
          action(() => {
          this.user = {...this.user}
          })
        }
        
        this.handleClose();
      })
      .catch((error) => {
        this.setAlert({
          open: true,
          message: error.message,
          type: "error",
        });
        return;
      });
  };

  handleOpen = () => {
    this.setOpen(true);
  };

  handleClose = () => {
    this.setOpen(false);
  };


  setCurrency(currency: string) {
    this.currency = currency;
    if (currency === "USD") this.symbol = "$";
    else if (currency === "MYR") this.symbol = "RM";
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

  setOpen(open: boolean) {
    this.open = open;
  }

  async initializeLeaderboard() {
    const querySnapshot = await getDocs(collection(db, "users"));
      const leaderboardData: User[] = [];
      querySnapshot.forEach((doc) => {
        const { balance, displayName, email } = doc.data();
        leaderboardData.push({ displayName, email, balance });
        if (auth.currentUser && auth.currentUser.uid === doc.id) {
          this.user!.balance = balance || null;
        }
      });

      action(() => {
      this.leaderboard = leaderboardData.sort(
        (a, b) => (b.balance as number) - (a.balance as number)
      );
      })();
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

  async initializeUser(
    balance: number,
    displayName: string,
    email: string,
    photoURL: string
  ) {
    this.user!.balance = parseFloat(balance.toFixed(2));
    this.user!.displayName = displayName;
    this.user!.email = email;
    this.user!.photoURL = photoURL;
    await setDoc(doc(db, "users", auth.currentUser!.uid), {
      balance: balance,
      displayName: displayName,
      email: email,
      photoURL: photoURL,
    });
  }

  async setBalance(newBalance: number) {
    this.user = {...this.user, ...{balance: parseFloat(newBalance.toFixed(2))}};
    await updateDoc(doc(db, "users", auth.currentUser!.uid), {
      balance: newBalance,
    });
  }

  async setResetBalance(resetBalance: number) {
    this.user = {...this.user, ...{balance: parseFloat(resetBalance.toFixed(2))}};
    await updateDoc(doc(db, "users", auth.currentUser!.uid), {
      balance: resetBalance,
    });
  }

  async setUpdateName(updatedName: string) {
    this.user = {...this.user, ...{displayName: updatedName}};
    await updateDoc(doc(db, "users", auth.currentUser!.uid), {
      displayName: updatedName,
    });
  }
}

const authStore = new AuthStore();

export default authStore;
