import { httpRequester } from "./httpRequester.js";

export const api = {
  
  register,
  login,
  getUserInfo,
  updateProfile,
};



async function register(signupData) {
  return await httpRequester.post(`auth/register`, signupData);
}

async function login(loginData) {
  return await httpRequester.post(`auth/login`, loginData);
}

async function getUserInfo() {
  return await httpRequester.get(`user/me`);
}

async function updateProfile(profileData) {
  return await httpRequester.patch(`user/me`, profileData);
}


