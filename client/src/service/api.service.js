import { httpRequester } from "./httpRequester.js";

export const api = {
  allBook,
  register,
  login,
};

async function register(signupData) {
  return await httpRequester.post(`auth/register`, signupData);
}

async function login(loginData) {
  return await httpRequester.post(`auth/login`, loginData);
}

async function allBook(params = {}) {
  // On utilise URLSearchParams pour transformer {page: 1, limit: 10} en "page=1&limit=10"
  const searchParams = new URLSearchParams(params).toString();
  const endpoint = searchParams ? `book?${searchParams}` : "book";

  return await httpRequester.get(endpoint);
}
