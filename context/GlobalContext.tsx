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
import axios from "axios";

type GlobalContextType = {
  userId: string | null;
  setUserId: (userId: string | null) => void;
  theme: string;
  setTheme: (theme: string) => void;
  selectedCrop: CropModel;
  setSelectedCrop: (crop: CropModel) => void;
  // Add weather state if needed
  weatherData?: any;
  setWeatherData?: (data: any) => void;
  weatherCity: any;
  setWeatherCity?: (data: any) => void;
};

const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

export const GlobalProvider = ({ children }: { children: ReactNode }) => {
  const [userId, setUserId] = useState<string | null>(null);
  const [theme, setTheme] = useState<string>("light");
  const [selectedCrop, setSelectedCrop] = useState<CropModel>(cropModels[0]); // Default to first crop
  const [weatherData, setWeatherData] = useState<any>(null); // weather state
  const [weatherCity, setWeatherCity] = useState<any>("chennai"); // weather state

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

  // You can also fetch weather data here if needed
  async function fetchWeather() {
    try {
      // get current city
      let city = weatherCity || "chennai";

      // weather api endpoint
      let url = `http://api.weatherapi.com/v1/current.json?key=${process.env.NEXT_PUBLIC_WEATHER_API_KEY}&q=${city}&aqi=no`;

      // response
      const response = await axios.get(url);
      setWeatherData(response.data);
      console.log("Fetch Weather : ", response.data);
    } catch (err) {
      console.log("error", err);
    }
  }

  useEffect(() => {
    fetchWeather();
  }, [weatherCity]); // Only depend on weatherCity, not weatherData

  return (
    <GlobalContext.Provider
      value={{
        userId,
        setUserId,
        theme,
        setTheme,
        selectedCrop,
        setSelectedCrop,
        weatherData,
        setWeatherData,
        weatherCity,
        setWeatherCity,
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
