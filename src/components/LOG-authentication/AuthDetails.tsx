import React, { useEffect, useState } from 'react';
import { auth } from '../../firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { User } from 'firebase/auth';
import "../../styles/main.scss";

interface AuthDetailsProps {
  handleLogout: () => void;
}

const AuthDetails: React.FC<AuthDetailsProps> = ({ handleLogout }) => {
  const [authUser, setAuthUser] = useState<User | null>(null);
  const [alert, setAlert] = useState<{ open: boolean, message: string, type: string }>({
    open: false,
    message: '',
    type: '',
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, user => {
      if (user) {
        setAuthUser(user);
      } else {
        setAuthUser(null);
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const userSignOut = () => {
    signOut(auth)
      .then(() => {
        setAuthUser(null);
        setAlert({ open: true, message: "Sign out successful", type: "success" });
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      })
      .catch((error) => {
        setAlert({ open: true, message: error.message, type: "error" });
      });
  };

  return (
    <div>
      {authUser ? (
        <>
          <a className="auth-button" onClick={userSignOut}>Sign Out</a>
        </>
      ) : (
        <p>Signed Out</p>
      )}
      {alert.open && (
        <div className={`alert alert-${alert.type}`}>
          {alert.message}
        </div>
      )}
    </div>
  );
};

export default AuthDetails;
