"use client";

import { useLanguage } from "@/lib/i18n";
import { Language } from "@/locales";

export default function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  return (
    <select
      value={language}
      onChange={(e) => setLanguage(e.target.value as Language)}
      className="bg-transparent border border-gray-300 text-gray-700 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block p-1.5 cursor-pointer dark:bg-gray-800 dark:border-gray-600 dark:text-white"
    >
      <option value="en">English</option>
      <option value="fr">Français</option>
      <option value="es">Español</option>
    </select>
  );
}
