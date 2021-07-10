import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';
import WalletConnectProvider from '@walletconnect/web3-provider';
import React, { Suspense, useState } from 'react';
import { ThemeSwitcherProvider } from 'react-css-theme-switcher';
import { RecoilRoot } from 'recoil';
import Web3Modal from 'web3modal';

import { ErrorBoundary, ErrorFallback } from '~~/components/layout/ErrorFallback';
import { MainPage } from '~~/components/routes/main/MainPage';
import { INFURA_ID } from '~~/models/constants/constants';
import '~~/styles/css/tailwind-base.pcss';
import '~~/styles/css/tailwind-components.pcss';
import '~~/styles/css/tailwind-utilities.pcss';
import '~~/styles/css/app.css';

const themes = {
  dark: `${process.env.PUBLIC_URL ?? ''}/dark-theme.css`,
  light: `${process.env.PUBLIC_URL ?? ''}/light-theme.css`,
};

const prevTheme = window.localStorage.getItem('theme');

const subgraphUri = 'http://localhost:8000/subgraphs/name/scaffold-eth/your-contract';

const client = new ApolloClient({
  uri: subgraphUri,
  cache: new InMemoryCache(),
});

const App = () => {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <RecoilRoot>
        <ApolloProvider client={client}>
          <ThemeSwitcherProvider themeMap={themes} defaultTheme={prevTheme || 'light'}>
            <ErrorBoundary FallbackComponent={ErrorFallback}>
              <Suspense fallback={<div />}>
                <MainPage subgraphUri={subgraphUri} />
              </Suspense>
            </ErrorBoundary>
          </ThemeSwitcherProvider>
        </ApolloProvider>
      </RecoilRoot>
    </ErrorBoundary>
  );
};

export default App;
