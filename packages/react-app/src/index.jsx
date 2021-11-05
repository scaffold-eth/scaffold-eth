import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import React from "react";
import { ThemeSwitcherProvider } from "react-css-theme-switcher";
import ReactDOM from "react-dom";
import { MoralisProvider } from "react-moralis";
import App from "./App";
import "./index.css";

// Kovan Server - Moralis
const APP_ID = "vuSHldvhCW1bxPzFVZBMsk205D3atbHQSAuAQ8pH";
const SERVER_URL = "https://ajhkv0lxp8el.usemoralis.com:2053/server";

const themes = {
  dark: `${process.env.PUBLIC_URL}/dark-theme.css`,
  light: `${process.env.PUBLIC_URL}/light-theme.css`,
};

const prevTheme = window.localStorage.getItem("theme");

const subgraphUri = "http://localhost:8000/subgraphs/name/scaffold-eth/your-contract";

const client = new ApolloClient({
  uri: subgraphUri,
  cache: new InMemoryCache(),
});

ReactDOM.render(
  <MoralisProvider appId={APP_ID} serverUrl={SERVER_URL}>
    <ApolloProvider client={client}>
      <ThemeSwitcherProvider themeMap={themes} defaultTheme={prevTheme || "light"}>
        <App subgraphUri={subgraphUri} />
      </ThemeSwitcherProvider>
    </ApolloProvider>
  </MoralisProvider>,
  document.getElementById("root"),
);
