import { createContext, useContext, useState } from 'react';

interface IATC {
  token: string | null;
  setToken: (token: string | null) => void
}

const AuthTokenContext = createContext<IATC>({
  token: localStorage.getItem('auth-token') || null,
  setToken: (_: string | null) => {}
});

export const AuthTokenProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(localStorage.getItem('auth-token') || null);

  const updateToken = (newToken: string | null) => {
    setToken(newToken);

    if(newToken === null) {
        localStorage.removeItem('auth-token');
    } else {
        localStorage.setItem('auth-token', newToken);
    }
  };

  return (
    <AuthTokenContext.Provider value={{ token, setToken: updateToken }}>
      {children}
    </AuthTokenContext.Provider>
  );
};

export const useAuthToken = () => {
  const context = useContext(AuthTokenContext);

  if(!context) {
    throw new Error('useAuthToken must be used within an AuthTokenProvider');
  }

  return context;
};

export default AuthTokenContext;
