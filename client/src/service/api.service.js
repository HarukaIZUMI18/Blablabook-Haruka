import { httpRequester } from "./httpRequester.js";

export const api = {
  allBook,
  register,
  login,
  getUserInfo,
  updateProfile,
  randomBook,
  search
};

async function register(signupData) {
  return await httpRequester.post(`auth/register`, signupData);
}

async function login(loginData) {
  return await httpRequester.post(`auth/login`, loginData);
}

async function allBook(params = {}) {
  const searchParams = new URLSearchParams(params).toString();
  const endpoint = searchParams ? `book?${searchParams}` : "book";
  return await httpRequester.get(endpoint);
}
  
async function getUserInfo() {
  return await httpRequester.get(`user/me`);
}
  
async function updateProfile(profileData) {
  return await httpRequester.patch(`user/me`, profileData);
}

async function randomBook() {
return await httpRequester.get(`book/random`);
}

async function getUserInfo() {
  return await httpRequester.get(`user/me`);
}

async function updateProfile(profileData) {
  return await httpRequester.patch(`user/me`, profileData);
}

async function search(query) {
  return await httpRequester.get(`book/search?q=${encodeURIComponent(query)}`);
}
