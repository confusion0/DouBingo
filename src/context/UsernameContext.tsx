import { createContext, useContext, useState } from 'react';

interface IUC {
  username: string | null;
  setUsername: (username: string | null) => void
}

const UsernameContext = createContext<IUC>({
  username: localStorage.getItem('username') || null,
  setUsername: (_: string | null) => {}
});

export const UsernameProvider = ({ children }: { children: React.ReactNode }) => {
  const [username, setUsername] = useState<string | null>(localStorage.getItem('username') || null);

  const updateUsername = (newUsername: string | null) => {
    setUsername(newUsername);

    if(newUsername === null) {
        localStorage.removeItem('username');
    } else {
        localStorage.setItem('username', newUsername);
    }
  };

  return (
    <UsernameContext.Provider value={{ username, setUsername: updateUsername }}>
      {children}
    </UsernameContext.Provider>
  );
};

export const useUsername = () => {
  const context = useContext(UsernameContext);

  if(!context) {
    throw new Error('useUsername must be used within an UsernameProvider');
  }

  return context;
};

export default UsernameContext;
