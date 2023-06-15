// import { createUserWithEmailAndPassword } from 'firebase/auth';
import React, { useState } from 'react'
// import {auth} from "../../firebase";
import { useNavigate } from 'react-router-dom';
import { UserAuth } from '../account/AuthContext';

export {};

interface SignupProps {
  handleClose: () => void;
}


const Signup = ({ handleClose }: SignupProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('')
  const { createUser } = UserAuth();
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    console.log(error);
    try {
      await createUser(email, password);
      navigate('/')
    } catch (e) {
      if (e instanceof Error) {
        setError(e.message)
        console.log(e.message)
      }
    }
  };

  return (
    <div className='signup-container'>
      <div>
        <h1>Sign up for a free account</h1>
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
        <button type="submit"> Sign Up</button>

      </form>
      <p className='py-2'>
  Already have an account?{' '}
  <span
    className='underline'
    onClick={handleClose}
  >
    Sign in.
  </span>
</p>

    </div>
  )
}

export default Signup