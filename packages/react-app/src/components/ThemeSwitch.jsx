import React, { useCallback, useEffect, useState } from "react";
import { Switch } from "antd";
import { useThemeSwitcher } from "react-css-theme-switcher";

export default function ThemeSwitcher() {

  // dark mode functionality
  const [isDarkMode, setIsDarkMode] = React.useState();
  const { switcher, currentTheme, status, themes } = useThemeSwitcher();

  const toggleTheme = (isChecked) => {
    setIsDarkMode(isChecked);
    switcher({ theme: isChecked ? themes.light : themes.dark });
  };

  // Avoid theme change flicker
  // if (status === "loading") {
  //   return null;
  // }
  // end dark mode stuff

  return (
    <div className="main fade-in" style={{padding: 100}}>
      <h1>The current theme is: {currentTheme}</h1>
      <Switch checked={isDarkMode} onChange={toggleTheme} />
    </div>
  );
}
