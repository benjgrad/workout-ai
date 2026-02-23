import AsyncStorage from "@react-native-async-storage/async-storage";
import { apiRequest, setAuthToken } from "./client";
import { LoginResponse } from "../types/plan";

const TOKEN_KEY = "auth_token";
const USER_ID_KEY = "user_id";

export async function login(
  email: string,
  password: string
): Promise<LoginResponse> {
  const response = await apiRequest<LoginResponse>("/v1/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });

  await AsyncStorage.setItem(TOKEN_KEY, response.token);
  await AsyncStorage.setItem(USER_ID_KEY, response.userId);
  setAuthToken(response.token);

  return response;
}

export async function loadStoredToken(): Promise<boolean> {
  const token = await AsyncStorage.getItem(TOKEN_KEY);
  if (token) {
    setAuthToken(token);
    return true;
  }
  return false;
}

export async function logout(): Promise<void> {
  await AsyncStorage.removeItem(TOKEN_KEY);
  await AsyncStorage.removeItem(USER_ID_KEY);
  setAuthToken(null);
}
