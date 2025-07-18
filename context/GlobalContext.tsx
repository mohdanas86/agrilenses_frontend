"use client"; // Required for Next.js app directory

import React, { createContext, useContext, useState, ReactNode } from "react";

type GlobalContextType = {
  user: any;
  setUser: (user: any) => void;
  theme: string;
  setTheme: (theme: string) => void;
};

const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

export const GlobalProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [theme, setTheme] = useState<string>("light");

  return (
    <GlobalContext.Provider value={{ user, setUser, theme, setTheme }}>
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = (): GlobalContextType => {
  const context = useContext(GlobalContext);
  if (!context) {
    throw new Error("useGlobalContext must be used within a GlobalProvider");
  }
  return context;
};
