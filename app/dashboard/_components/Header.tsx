"use client";

import { Button } from "@/components/ui/button";
import { History, Languages, Leaf } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

const languages = [
  { code: "en", name: "English", native: "English" },
  { code: "hi", name: "Hindi", native: "हिंदी" },
  { code: "ta", name: "Tamil", native: "தமிழ்" },
  { code: "te", name: "Telugu", native: "తెలుగు" },
  { code: "kn", name: "Kannada", native: "ಕನ್ನಡ" },
  { code: "ml", name: "Malayalam", native: "മലയാളം" },
];

const Header = () => {
  const router = useRouter();
  const [currentLanguage, setCurrentLanguage] = useState("en");
  const [showLanguages, setShowLanguages] = useState(false);
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-3">
            <div className="bg-green-600 rounded-full p-2">
              <Leaf className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Agri-Lens</h1>
              <p className="text-sm text-gray-500">Smart Crop Health Monitor</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="relative">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowLanguages(!showLanguages)}
                className="flex items-center space-x-2"
              >
                <Languages className="h-4 w-4" />
                <span>
                  {
                    languages.find((lang) => lang.code === currentLanguage)
                      ?.native
                  }
                </span>
              </Button>

              {showLanguages && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border z-10">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        setCurrentLanguage(lang.code);
                        setShowLanguages(false);
                      }}
                      className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                    >
                      {lang.native} ({lang.name})
                    </button>
                  ))}
                </div>
              )}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push("/history")}
            >
              <History className="h-4 w-4 mr-2" />
              My Scans
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
