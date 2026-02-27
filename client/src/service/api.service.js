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
  const searchParams = new URLSearchParams(params).toString();
  const endpoint = searchParams ? `book?${searchParams}` : "book";

  return await httpRequester.get(endpoint);
}
