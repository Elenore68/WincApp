import axiosClient, { applyToken } from "./axiosClient";
import { API } from "./endpoints";

const LOCAL_STORAGE_TOKEN_KEY = "idToken";

/**
 * Sign up a new user.
 */
export const signUp = async (payload) => {
  const response = await axiosClient.post(API.USER.ROOT, payload);
  return response.data;
};

/**
 * Sign in user and store idToken.
 */
export const signIn = async (payload) => {
  const response = await axiosClient.post(API.USER.SIGN_IN, payload);
  const { idToken, refreshToken, localId } = response.data;

  if (idToken) {
    localStorage.setItem("idToken", idToken);
    applyToken(); // 🟢 Refresh axios client with new token
  }

  return { idToken, refreshToken, localId };
};

/**
 * Get the currently authenticated user.
 * Requires Authorization header (added by axiosClient).
 */
export const getAuthenticatedUser = async () => {
  const response = await axiosClient.get(API.USER.ROOT);
  return response;
};

/**
 * Get stored ID token.
 */
export const getStoredToken = () => {
  return localStorage.getItem(LOCAL_STORAGE_TOKEN_KEY);
};

/**
 * Clear stored ID token.
 */
export const clearStoredToken = () => {
  localStorage.removeItem(LOCAL_STORAGE_TOKEN_KEY);
};
