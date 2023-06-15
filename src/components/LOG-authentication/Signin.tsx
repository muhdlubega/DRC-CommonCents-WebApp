// import { signInWithEmailAndPassword} from 'firebase/auth';
import React, { useState } from 'react'
// import {auth} from "../../firebase";
import { useNavigate } from 'react-router-dom';
import { UserAuth } from '../account/AuthContext';
import Signup from './Signup';


const Signin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { signIn } = UserAuth();
  const [showSignup, setShowSignup] = useState(false);


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    console.log(error);
    try {
      await signIn(email, password);
      navigate('/');
    } catch (e) {
      if (e instanceof Error) {
        setError(e.message);
        console.log(e.message);
      }
    }
  };
  
  const handleSignupLinkClick = () => {
    setShowSignup(true);
  };
  

  /*const signInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    }catch (err) {
      console.error(err);
    }
    };
  */

  return (
    <div className='signin-container'>
      <div>
        <h1>Sign in to your account</h1>
      </div>
      <form onSubmit={handleSubmit}>
        <input
         type='email'
          placeholder='Enter your email' 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          ></input>
        <input 
        type='password' 
        placeholder='Enter your password' 
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        ></input>
        <button type="submit"> Sign In</button>
      </form>
      <p>
      Don't have an account yet?{' '}
      <span
        className='underline'
        onClick={handleSignupLinkClick}
      >
        Sign up.
      </span>
    </p>
    {showSignup && (
      <div className='signup-popup'>
        <Signup handleClose={() => setShowSignup(false)} />
      </div>
    )}
  </div>
  )
  }

export default Signin