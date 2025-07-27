"use client"; // Required for Next.js app directory

import { useUser } from "@clerk/nextjs";
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";

type GlobalContextType = {
  userId: string | null;
  setUserId: (userId: string | null) => void;
  theme: string;
  setTheme: (theme: string) => void;
};

const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

export const GlobalProvider = ({ children }: { children: ReactNode }) => {
  const [userId, setUserId] = useState<string | null>(null);
  const [theme, setTheme] = useState<string>("light");

  // Use Clerk's useUser hook to get user info
  const { user, isLoaded } = useUser();

  // Log user ID when the component mounts or when user changes
  useEffect(() => {
    if (!isLoaded) return;
    if (!user) {
      console.error("User is not signed in.");
      return;
    }

    setUserId(user.id);
    console.log("User ID:", userId);
  }, [user, isLoaded]);

  return (
    <GlobalContext.Provider value={{ userId, setUserId, theme, setTheme }}>
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
