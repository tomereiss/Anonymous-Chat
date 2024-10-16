import { createContext, useContext, useState, ReactNode } from 'react';

interface AuthContextType {
  token: string;
  setToken: (token: string) => void;
  currentUser: string | null;
  setCurrentUser: (user: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider (children: ReactNode){
  const [token, setToken] = useState<string>("");
  const [currentUser, setCurrentUser] = useState<string>("");

  return (
    <AuthContext.Provider value={{ token, setToken, currentUser, setCurrentUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
