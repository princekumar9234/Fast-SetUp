import { AuthContext } from "../auth.context";
import { login,register,getMe,emailVerify } from "../services/auth.api";

import React, { useContext, useEffect } from 'react'

export const useAuth = () => {

const context = useContext(AuthContext);
const {user,setUser,loading, setLoading} = context;

const handleRegister = async ({ email, password, username }) => {
    setLoading(true);
    try {
      const data = await register({ username, email, password });
      setUser(data.user);
    } catch (err) {
      console.log(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

 const handleEmailVerify = async ({ email, otp }) => {
    setLoading(true);
    try {
      const data = await emailVerify({ email, otp });
      setUser(data.user);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

const handleLogin = async ({email, password}) => {
    setLoading(true);
    try {
        const data = await login({email, password});
        setUser(data.user);
    }
     catch(error){
        console.log(error);
        throw new Error;
     }
     finally{
        setLoading(false);
     }
}

 useEffect(() => {
    const getAndSetUser = async () => {
      try{
        const data = await getMe();
      setUser(data.user);
      } catch(err) {
        console.log(err);
        
      }
       finally{
        setLoading(false);
       }
    };
    getAndSetUser();
  }, []);


  return {
    user, loading, handleLogin, handleRegister , handleEmailVerify
  }
}


