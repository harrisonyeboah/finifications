import { createContext, useState } from "react";

export const AppContext = createContext();

export function AppProvider({ children }) {
    const [commited, setCommited] = useState(false);

  return (
    <AppContext.Provider value={{ commited, setCommited}}>
      {children}
    </AppContext.Provider>
  );
  // This is it 
}
