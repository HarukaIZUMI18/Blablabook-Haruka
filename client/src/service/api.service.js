import { httpRequester } from "./httpRequester.js";

export const api = {
  allBook,
  getBookById,
  getBook,
  register,
  login,
  getUserInfo,
  updateProfile,
  deleteAccount,
  randomBook,
  search,
  getCollection,
  addToCollection,
  updateCollectionStatus,
  removeFromCollection,
  allThread,
  getThread,
  createThread,
  deleteThread,
  addComment,
  deleteComment,
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

async function getBook(id) {
  return await httpRequester.get(`book/${id}`);
}

async function getUserInfo() {
  return await httpRequester.get(`user/me`);
}

async function randomBook() {
  return await httpRequester.get(`book/random`);
}

async function search(query) {
  return await httpRequester.get(`book/search?q=${encodeURIComponent(query)}`);
}

async function getBookById(id) {
  return await httpRequester.get(`book/${id}`);
}

async function updateProfile(profileData) {
  return await httpRequester.patch(`user/me`, profileData);
}
async function deleteAccount(deleteData) {
  return await httpRequester.delete(`user/me`, deleteData);
}

async function getCollection(status = null) {
  const endpoint = status
    ? `collection?status=${encodeURIComponent(status)}`
    : "collection";
  return await httpRequester.get(endpoint);
}

async function addToCollection(bookId, status = "à lire") {
  return await httpRequester.post(`book/${bookId}/collection`, { status });
}

async function updateCollectionStatus(bookId, status) {
  return await httpRequester.patch(`book/${bookId}/collection`, { status });
}

async function removeFromCollection(bookId) {
  return await httpRequester.delete(`book/${bookId}/collection`);
}

async function allThread(params = {}) {
  const searchParams = new URLSearchParams(params).toString();
  const endpoint = searchParams ? `thread?${searchParams}` : "thread";
  return await httpRequester.get(endpoint);
}

async function getThread(id) {
  return await httpRequester.get(`thread/${id}`);
}

async function createThread(threadData) {
  return await httpRequester.post(`thread`, threadData);
}

async function deleteThread(id) {
  return await httpRequester.delete(`thread/${id}`);
}

async function addComment(threadId, body) {
  return await httpRequester.post(`thread/${threadId}/comment`, { body });
}

async function deleteComment(threadId, commentId) {
  return await httpRequester.delete(`thread/${threadId}/comment/${commentId}`);
}
