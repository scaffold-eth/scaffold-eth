import { Menu } from "antd";
import "antd/dist/antd.css";
import Head from "next/head";
import React, { useEffect, useRef, useState } from "react";
import { ThemeSwitcherProvider } from "react-css-theme-switcher";
import { Header } from "../components";
import DevUI from "../components/DevUI";
import { Web3Provider } from "../helpers/Web3Context";
import "../styles/index.css";

const { SubMenu } = Menu;

function MyApp({ Component, pageProps }) {
  const prevTheme = useRef("light");

  const themes = {
    dark: `/css/dark-theme.css`,
    light: `/css/light-theme.css`,
  };

  useEffect(() => {
    prevTheme.current = window.localStorage.getItem("theme");
  }, []);

  return (
    <Web3Provider network="localhost">
      <ThemeSwitcherProvider themeMap={themes} defaultTheme={prevTheme.current}>
        <>
          <Head>
            <link
              rel="icon"
              href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🏗</text></svg>"
            />
          </Head>
          <Header />
          <MenuHeader />
          <DevUI />
          <Component {...pageProps} />
        </>
      </ThemeSwitcherProvider>
    </Web3Provider>
  );
}

// todo: implement the next/router for routing the pages
const MenuHeader = () => {
  const [current, setCurrent] = useState();

  const handleMenuClick = e => {
    setCurrent(e.key);
  };

  return (
    <Menu onClick={handleMenuClick} selectedKeys={[current]} mode="horizontal">
      <Menu.Item key="home">
        <a href="/">Home</a>
      </Menu.Item>
      <Menu.Item key="debug">
        <a href="/debug">Debug Contracts</a>
      </Menu.Item>
    </Menu>
  );
};

export default MyApp;
