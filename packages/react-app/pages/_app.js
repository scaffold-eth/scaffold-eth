import "../styles/index.css";
import "antd/dist/antd.css";
import React, { useEffect, useRef } from "react";
import { Web3Provider } from "../helpers/Web3Context";
import { Header } from "../components";
import DevUI from "../components/DevUI";
import { Menu } from "antd";
import Link from "next/link";
import { ThemeSwitcherProvider } from "react-css-theme-switcher";
import Head from "next/head";
import { useRouter } from "next/router";

const targetNetwork = "localhost";

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const prevTheme = useRef("light");

  const themes = {
    dark: `/css/dark-theme.css`,
    light: `/css/light-theme.css`,
  };

  useEffect(() => {
    prevTheme.current = window.localStorage.getItem("theme");
  }, []);

  return (
    <Web3Provider network={targetNetwork}>
      <ThemeSwitcherProvider themeMap={themes} defaultTheme={prevTheme.current}>
        <>
          <Head>
            <link
              rel="icon"
              href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🏗</text></svg>"
            />
          </Head>
          <Header />
          <DevUI />
          <Menu style={{ textAlign: "center" }} selectedKeys={[router.asPath]} mode="horizontal">
            <Menu.Item key="/">
              <Link href="/">
                <a>YourCollectibles</a>
              </Link>
            </Menu.Item>
            <Menu.Item key="/transfers">
              <Link href="/transfers">
                <a>Transfers</a>
              </Link>
            </Menu.Item>
            <Menu.Item key="/ipfsup">
              <Link href="/ipfsup">
                <a>IPFS Upload</a>
              </Link>
            </Menu.Item>
            <Menu.Item key="/ipfsdown">
              <Link href="/ipfsdown">
                <a>IPFS Download</a>
              </Link>
            </Menu.Item>
            <Menu.Item key="/debugcontracts">
              <Link href="/debugcontracts">
                <a>Debug Contracts</a>
              </Link>
            </Menu.Item>
          </Menu>
          <Component {...pageProps} />
        </>
      </ThemeSwitcherProvider>
    </Web3Provider>
  );
}

export default MyApp;
