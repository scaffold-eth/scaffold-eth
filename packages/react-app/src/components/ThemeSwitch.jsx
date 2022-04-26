import React, { useState } from "react";
import { Switch } from "@headlessui/react";
import { classNames } from "../helpers";
import { SunIcon, MoonIcon } from "@heroicons/react/solid";

export default function ThemeSwitcher() {
  const theme = window.localStorage.getItem("theme");
  const [isDarkMode, setIsDarkMode] = useState(!(!theme || theme === "light"));

  // Add the following to this conditional if you want the theme to be dark by default depending on user's preference
  // || (!('theme' in window.localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)
  if (theme === "dark") {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }

  const toggleTheme = isChecked => {
    setIsDarkMode(isChecked);
    if (isChecked) {
      window.localStorage.setItem("theme", "dark");
    } else {
      window.localStorage.setItem("theme", "light");
    }
  };

  return (
    <Switch
      checked={isDarkMode}
      onChange={toggleTheme}
      className={classNames(
        isDarkMode ? "bg-black" : "bg-gray-200",
        "relative inline-flex flex-shrink-0 h-8 w-14 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none",
      )}
    >
      <span className="sr-only">Use setting</span>
      <span
        className={classNames(
          isDarkMode ? "translate-x-6" : "translate-x-0",
          "pointer-events-none relative inline-block h-7 w-7 rounded-full bg-white dark:bg-gray-800 shadow transform transition ease-in-out duration-200",
        )}
      >
        <span
          className={classNames(
            isDarkMode ? "opacity-0 ease-out duration-100" : "opacity-100 ease-in duration-200",
            "absolute inset-0 h-full w-full flex items-center justify-center transition-opacity",
          )}
          aria-hidden="true"
        >
          <SunIcon className="text-yellow-400" aria-hidden="true" />
        </span>
        <span
          className={classNames(
            isDarkMode ? "opacity-100 ease-in duration-200" : "opacity-0 ease-out duration-100",
            "absolute inset-0 h-full w-full flex items-center justify-center transition-opacity",
          )}
          aria-hidden="true"
        >
          <MoonIcon className="text-yellow-400" aria-hidden="true" />
        </span>
      </span>
    </Switch>
  );
}
