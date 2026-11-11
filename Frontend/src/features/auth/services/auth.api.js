import axios from "axios";

const api = await axios.create({
  baseURL: "http://loacalhost:300",
  withCredentials: true,
});

export async function register({username, email, password}) {
  try{
    const response = await api.post("/user/register",{
      username,
      email,
      password
    });
    return response.data;
  } catch(error){
    console.log(error);
    throw new Error;
  }
}

export async function emailVerify({email, otp}) {
   try {
    const response = await api.post("/user/emailVerify",{
      email,
      otp
    })
    return response.data;

   } catch (error) {
     console.log(error);
   }
}

export async function login({email, password}) {
  try {
     const response =await api.post("/user/login", {
      email,
      password
     }) 
     return response.data;

  } catch (error) {
    console.log(error);
  }
}

export async function getMe() {
  try {
    const response = await api.get("/user/get-me");
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}