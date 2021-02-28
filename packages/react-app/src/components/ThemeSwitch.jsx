import React, { useEffect, useState } from "react";
import { Switch } from "antd";
import { useThemeSwitcher } from "react-css-theme-switcher";

export default function ThemeSwitcher() {

  const [isDarkMode, setIsDarkMode] = useState(window.localStorage.getItem("theme") == "dark" || window.localStorage.getItem("theme") == null ? false : true);
  const { switcher, currentTheme, status, themes } = useThemeSwitcher();

  useEffect(() => {
    window.localStorage.setItem("theme", currentTheme);
  }, [isDarkMode]);

  const toggleTheme = (isChecked) => {
    setIsDarkMode(isChecked);
    switcher({ theme: isChecked ? themes.light : themes.dark });
  };

  // Avoid theme change flicker
  // if (status === "loading") {
  //   return null;
  // }

  return (
    <div className="main fade-in" style={{padding: 100}}>
      <h1>The current theme is: {currentTheme}</h1>
      <Switch checked={isDarkMode} onChange={toggleTheme} />
    </div>
  );
}
