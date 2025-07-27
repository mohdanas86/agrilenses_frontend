"use client"; // Required for Next.js app directory

import { useUser } from "@clerk/nextjs";
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";

// Import CropModel type
import { CropModel } from "@/app/dashboard/scanner/_components/types";
import { cropModels } from "@/app/dashboard/scanner/_components/crop-models";

type GlobalContextType = {
  userId: string | null;
  setUserId: (userId: string | null) => void;
  theme: string;
  setTheme: (theme: string) => void;
  selectedCrop: CropModel;
  setSelectedCrop: (crop: CropModel) => void;
};

const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

export const GlobalProvider = ({ children }: { children: ReactNode }) => {
  const [userId, setUserId] = useState<string | null>(null);
  const [theme, setTheme] = useState<string>("light");
  const [selectedCrop, setSelectedCrop] = useState<CropModel>(cropModels[0]); // Default to first crop

  // Use Clerk's useUser hook to get user info
  const { user, isLoaded } = useUser();

  // Log user ID when the component mounts or when user changes
  useEffect(() => {
    if (!isLoaded) return;
    if (!user) {
      console.log("User is not signed in.");
      return;
    }

    setUserId(user.id);
    console.log("User ID:", userId);
  }, [user, isLoaded]);

  return (
    <GlobalContext.Provider
      value={{
        userId,
        setUserId,
        theme,
        setTheme,
        selectedCrop,
        setSelectedCrop,
      }}
    >
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
