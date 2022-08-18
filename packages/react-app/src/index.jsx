import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import React from "react";
import { ThemeSwitcherProvider } from "react-css-theme-switcher";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import { WagmiConfig } from "wagmi";
import App from "./App";
import "./index.css";
import { client } from "./utils/wagmi";

const themes = {
  dark: `${process.env.PUBLIC_URL}/dark-theme.css`,
  light: `${process.env.PUBLIC_URL}/light-theme.css`,
};

const prevTheme = window.localStorage.getItem("theme");

// Update subgraph URL after you deploy your project
const subgraphUri = "http://localhost:8000/subgraphs/name/scaffold-eth/your-contract";

const apolloClient = new ApolloClient({
  uri: subgraphUri,
  cache: new InMemoryCache(),
});

ReactDOM.render(
  <ApolloProvider client={apolloClient}>
    <ThemeSwitcherProvider themeMap={themes} defaultTheme={prevTheme || "light"}>
      <WagmiConfig client={client}>
        <BrowserRouter>
          <App subgraphUri={subgraphUri} />
        </BrowserRouter>
      </WagmiConfig>
    </ThemeSwitcherProvider>
  </ApolloProvider>,
  document.getElementById("root"),
);
