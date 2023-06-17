import { createContext, useContext, useEffect, ReactNode } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";
import { useLocalObservable } from "mobx-react";
import GlobalStore from "./GlobalStore";

interface GlobalState {
  store: GlobalStore;
}

const GlobalContext = createContext<GlobalState | undefined>(undefined);

interface ContextProps {
  children: ReactNode;
}

const Context: React.FC<ContextProps> = ({ children }) => {
  const store = useLocalObservable(() => new GlobalStore());

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) store.setUser(user);
      else store.setUser(null);
    });
  }, [store]);

  useEffect(() => {
    // Update symbol when currency changes
    if (store.currency === "INR") store.symbol = "₹";
    else if (store.currency === "USD") store.symbol = "$";
  }, [store.currency]);

  const globalState: GlobalState = {
    store,
  };

  return (
    <GlobalContext.Provider value={globalState}>
      {children}
    </GlobalContext.Provider>
  );
};

export default Context;

export const useGlobalState = (): GlobalStore => {
  const globalState = useContext(GlobalContext);
  if (!globalState) {
    throw new Error("useGlobalState must be used within a Context.Provider");
  }
  return globalState.store;
};
