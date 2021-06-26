import { Switch } from 'antd';
import React, { useEffect, useState } from 'react';
import { useThemeSwitcher } from 'react-css-theme-switcher';

export const ThemeSwitcher = () => {
  const theme = window.localStorage.getItem('theme');
  const [isDarkMode, setIsDarkMode] = useState(!(!theme || theme === 'light'));
  const { switcher, currentTheme, status, themes } = useThemeSwitcher();

  useEffect(() => {
    window.localStorage.setItem('theme', currentTheme ?? '');
  }, [currentTheme]);

  const toggleTheme = (isChecked: boolean) => {
    setIsDarkMode(isChecked);
    switcher({ theme: isChecked ? themes.dark : themes.light });
  };

  // Avoid theme change flicker
  // if (status === "loading") {
  //   return null;
  // }

  return (
    <div className="main fade-in" style={{ position: 'fixed', right: 8, bottom: 8 }}>
      <span style={{ padding: 8 }}>{currentTheme === 'light' ? '☀️' : '🌜'}</span>
      <Switch checked={isDarkMode} onChange={toggleTheme} />
    </div>
  );
};
