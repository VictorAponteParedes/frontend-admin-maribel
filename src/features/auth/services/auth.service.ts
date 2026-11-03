import { httpClient } from "@/lib/httpClient";
import { LoginFormData } from "../types/auth.types";
import { AuthUser } from "@/store/useAuthStore";

export interface LoginResponseData {
  user: AuthUser;
  token: string;
  refreshToken: string;
}

export const authService = {
  login: async (credentials: LoginFormData): Promise<LoginResponseData> => {
    const response = await httpClient.post("/auth/login", credentials);
    return response.data.data;
  },

  getProfile: async (): Promise<AuthUser> => {
    const response = await httpClient.get("/auth/profile");
    return response.data.data;
  },
};
