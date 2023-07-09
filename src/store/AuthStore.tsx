import { GoogleAuthProvider, createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signInWithPopup, updateProfile } from "firebase/auth";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  setDoc,
  updateDoc
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
  displayName?: string | null;
  email?: string | null;
  photoURL?: string | null | undefined;
  balance?: number | null | undefined;
  totalProfit?: number  | null | undefined;
  totalLoss?: number  | null | undefined;
  netWorth?: number  | null | undefined;
}

export interface Summary {
  totalProfit: number;
  totalLoss: number;
  netWorth: number;
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
  totalAmountWon: number = 0;
  totalAmountLost: number = 0;
  userNetWorth: number = 0;
  leaderboard: User[] = [];
  firestore = getFirestore();
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
      totalAmountWon: observable,
      totalAmountLost: observable,
      userNetWorth: observable,
      leaderboard: observable,
      firestore: observable,
      usersRef: observable,
      docs: observable,
      signInWithGoogle: action,
      handleClose: action,
      handleOpen: action,
      handleSignUp: action,
      getUserNetWorth: action,
      setEmail: action.bound,
      setPassword: action.bound,
      setConfirmPassword: action.bound,
      setTotalAmountLost: action.bound,
      setTotalAmountWon: action.bound,
      setUserNetWorth: action.bound,
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
    } catch (error: unknown) {
      authStore.setAlert({
        open: true,
        message: (error as { message: string }).message,
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
    } catch (error: unknown) {
      authStore.setAlert({
        open: true,
        message: (error as { message: string }).message,
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
    .then(async (res) => {
      var userExists:boolean = false;
        
        this.setAlert({
          open: true,
          message: `Sign Up Successful. Welcome ${res.user.email}`,
          type: "success",
        });
        
        const querySnapshot = await getDocs(collection(db, "users"));
          querySnapshot.forEach((doc) => {
            if (doc.id === auth.currentUser!.uid) {
              userExists = true;
            }
          }
        );

        if (!userExists) {
          this.initializeUser(100000, res.user.displayName as string, res.user.email as string, res.user.photoURL as string);
        }
        else {
          action(() => {
            this.user = {...this.user};
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

  // async initializeLeaderboard() {
  //   const querySnapshot = await getDocs(collection(db, "users"));
  //     const leaderboardData: User[] = [];
  //     querySnapshot.forEach((doc) => {
  //       const { balance, displayName, email } = doc.data();
  //       leaderboardData.push({ displayName, email, balance });
  //       if (auth.currentUser && auth.currentUser.uid === doc.id) {
  //         this.user!.balance = balance || null;
  //       }
  //     });

  //     action(() => {
  //     this.leaderboard = leaderboardData.sort(
  //       (a, b) => (b.balance as number) - (a.balance as number)
  //     );
  //     })();
  // }

  async initializeLeaderboard() {
    try {
      const querySnapshot = await getDocs(collection(db, "users"));
      const leaderboardData: User[] = [];
  
      await Promise.all(
        querySnapshot.docs.map(async (user) => {
          const tradeSummaryRef = doc(
            db,
            "users",
            user.id,
            "tradeHistory",
            "tradeSummary"
          );
          const tradeSummarySnapshot = await getDoc(tradeSummaryRef);
          const tradeSummary = tradeSummarySnapshot.data() as Summary;
  
          const { balance, displayName, email } = user.data();
          leaderboardData.push({
            displayName,
            email,
            balance,
            netWorth: tradeSummary?.netWorth || 0,
          });
  
          if (auth.currentUser && auth.currentUser.uid === user.id) {
            this.user!.balance = balance || null;
          }
        })
      );
  
      action(() => {
        this.leaderboard = leaderboardData.sort(
          (a, b) => (b.netWorth as number) - (a.netWorth as number)
        );
      })();
    } catch (error) {
      console.error("Error:", error);
    }
  }

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
    if (auth.currentUser !== null) {
      updateProfile(auth.currentUser, {
        displayName: updatedName
      });
    }
  }


  setTotalAmountWon(totalAmountWon: number) {
    this.totalAmountWon = totalAmountWon;
  }

  setTotalAmountLost(totalAmountLost: number) {
    this.totalAmountLost = totalAmountLost;
  }

  setUserNetWorth(userNetWorth: number) {
    this.userNetWorth = userNetWorth;
  }

  getUserNetWorth = async () => {
    const querySnapshot = await getDoc(doc(db, "users", auth.currentUser!.uid, "tradeHistory", "tradeSummary"));
    const data = querySnapshot.data() 
    if (!querySnapshot.exists()) {
        const initialTradeSummary = {
          totalProfit: 0,
          totalLoss: 0,
          netWorth: 0,
          timestamp: Date.now()
        };
        await setDoc(doc(db, "users", auth.currentUser!.uid, "tradeHistory", "tradeSummary"), initialTradeSummary);
      }
      // querySnapshot.forEach((doc) => {
      //   const { totalProfit, totalLoss, netWorth } = doc.data();
        // if (auth.currentUser && auth.currentUser.uid === doc.id) {
          this.setTotalAmountWon(data?.totalProfit);
          this.setTotalAmountLost(data?.totalLoss);
          this.setUserNetWorth(data?.netWorth);
        // }
      // }
    // );
  }
}

const authStore = new AuthStore();

export default authStore;
