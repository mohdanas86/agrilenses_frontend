"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Languages } from "lucide-react";
import type { Language } from "../page";

interface LanguageSelectorProps {
  languages: Language[];
  currentLanguage: string;
  onLanguageChange: (language: string) => void;
}

export function LanguageSelector({
  languages,
  currentLanguage,
  onLanguageChange,
}: LanguageSelectorProps) {
  const currentLang = languages.find((l) => l.code === currentLanguage);

  return (
    <div className="flex items-center gap-2">
      <Languages className="h-5 w-5 text-gray-500" />
      <Select value={currentLanguage} onValueChange={onLanguageChange}>
        <SelectTrigger className="w-48 border-green-200 focus:border-green-400">
          <SelectValue>
            <div className="flex items-center gap-2">
              <span className="text-lg">{currentLang?.flag}</span>
              <span className="font-medium">{currentLang?.name}</span>
            </div>
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {languages.map((language) => (
            <SelectItem key={language.code} value={language.code}>
              <div className="flex items-center gap-2">
                <span className="text-lg">{language.flag}</span>
                <span>{language.name}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
