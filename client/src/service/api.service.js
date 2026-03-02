import { httpRequester } from "./httpRequester.js";

export const api = {
  allBook,
  getBookById,
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
  
  // Récupérer un livre par Id pour Détail d'un livre

  async function getBookById(id) {
    return await httpRequester.get(`book/${id}`);
  }