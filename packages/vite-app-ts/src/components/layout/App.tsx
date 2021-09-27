import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';
import React, { FC, Suspense } from 'react';
import { ThemeSwitcherProvider } from 'react-css-theme-switcher';
import { EthComponentsContext, IEthComponentsContext } from 'eth-components/models';

import { ErrorBoundary, ErrorFallback } from '~~/components/layout/ErrorFallback';
import { MainPage } from '~~/components/routes/main/MainPage';
import '~~/styles/css/tailwind-base.pcss';
import '~~/styles/css/tailwind-components.pcss';
import '~~/styles/css/tailwind-utilities.pcss';
import '~~/styles/css/app.css';
import { BLOCKNATIVE_DAPPID } from '~~/models/constants/constants';

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

const context: IEthComponentsContext = {
  apiKeys: {
    BlocknativeDappId: BLOCKNATIVE_DAPPID,
  },
};

const App: FC = () => {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <ApolloProvider client={client}>
        <ThemeSwitcherProvider themeMap={themes} defaultTheme={prevTheme || 'light'}>
          <ErrorBoundary FallbackComponent={ErrorFallback}>
            <Suspense fallback={<div />}>
              <EthComponentsContext.Provider value={context}>
                <MainPage subgraphUri={subgraphUri} />
              </EthComponentsContext.Provider>
            </Suspense>
          </ErrorBoundary>
        </ThemeSwitcherProvider>
      </ApolloProvider>
    </ErrorBoundary>
  );
};

export default App;
