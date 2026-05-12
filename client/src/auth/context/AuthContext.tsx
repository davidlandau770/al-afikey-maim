/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState } from "react";
import axios from "axios";

export type UserRole = "owner" | "admin";

interface AuthContextValue {
  token: string | null;
  username: string | null;
  role: UserRole | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue>({
  token: null,
  username: null,
  role: null,
  login: async () => {},
  logout: () => {},
});

const TOKEN_KEY = "admin_token";
const ROLE_KEY = "admin_role";
const USER_KEY = "admin_username";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem(TOKEN_KEY),
  );
  const [role, setRole] = useState<UserRole | null>(
    () => localStorage.getItem(ROLE_KEY) as UserRole | null,
  );
  const [username, setUsername] = useState<string | null>(() =>
    localStorage.getItem(USER_KEY),
  );

  const login = async (u: string, password: string) => {
    const { data } = await axios.post<{
      token: string;
      role: UserRole;
      username: string;
    }>("/api/auth/login", { username: u, password });
    localStorage.setItem(TOKEN_KEY, data.token);
    localStorage.setItem(ROLE_KEY, data.role);
    localStorage.setItem(USER_KEY, data.username);
    setToken(data.token);
    setRole(data.role);
    setUsername(data.username);
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(ROLE_KEY);
    localStorage.removeItem(USER_KEY);
    setToken(null);
    setRole(null);
    setUsername(null);
  };

  return (
    <AuthContext.Provider value={{ token, username, role, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
