import React, { useEffect, useState } from "react";
import { Switch } from "antd";
import { useThemeSwitcher } from "react-css-theme-switcher";

export default function ThemeSwitcher() {

  const theme = window.localStorage.getItem("theme");
  const [isDarkMode, setIsDarkMode] = useState(!theme || theme == "light" ? false : true);
  const { switcher, currentTheme, status, themes } = useThemeSwitcher();

  useEffect(() => {
    window.localStorage.setItem("theme", currentTheme);
  }, [currentTheme]);

  const toggleTheme = (isChecked) => {
    setIsDarkMode(isChecked);
    switcher({ theme: isChecked ? themes.dark : themes.light });
  };

  // Avoid theme change flicker
  // if (status === "loading") {
  //   return null;
  // }

  return (
    <div className="main fade-in" style={{padding: 100}}>
      <h1>The current theme is: {currentTheme ? currentTheme : "light"}</h1>
      <Switch checked={isDarkMode} onChange={toggleTheme} />
    </div>
  );
}
