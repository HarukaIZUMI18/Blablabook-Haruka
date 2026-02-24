import { httpRequester } from "./httpRequester.js";

export const api = {
  
  register,
  login,
};



async function register(signupData) {
  return await httpRequester.post(`auth/register`, signupData);
}

async function login(loginData) {
  return await httpRequester.post(`auth/login`, loginData);
}


