import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import React from "react";
import { ThemeSwitcherProvider } from "react-css-theme-switcher";
import ReactDOM from "react-dom";
import App from "./App";
import "./index.css";

// Chakra theme config
const theme = extendTheme({
  config: {
    initialColorMode: "light",
  },
});

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

// Wrap the App component with Chakra UI
ReactDOM.render(
  <ApolloProvider client={client}>
    <ThemeSwitcherProvider themeMap={themes} defaultTheme={prevTheme || "light"}>
      <ChakraProvider theme={theme}>
        <App subgraphUri={subgraphUri} />
      </ChakraProvider>
    </ThemeSwitcherProvider>
  </ApolloProvider>,
  document.getElementById("root"),
);
