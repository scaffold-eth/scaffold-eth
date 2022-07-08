import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client'
import React from 'react'
import { BrowserRouter, Route } from 'react-router-dom'
import ReactDOM from 'react-dom'
import App from './App'
import './index.css'
import { ThemeProvider } from '@mui/material/styles'
import { theme } from './themes/createTheme'
import { CssBaseline } from '@mui/material'
import { ethers } from 'ethers'

const subgraphUri = 'http://localhost:8000/subgraphs/name/scaffold-eth/your-contract'

const client = new ApolloClient({
  uri: subgraphUri,
  cache: new InMemoryCache(),
})

const localProvider = new ethers.providers.StaticJsonRpcProvider('https://mainnet.optimism.io')
const mainnet = new ethers.providers.StaticJsonRpcProvider(
  'https://mainnet.infura.io/v3/1b3241e53c8d422aab3c7c0e4101de9c',
)

ReactDOM.render(
  <ApolloProvider client={client}>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Route path="/">
          <App mainnet={mainnet} localProvider={localProvider} />
        </Route>
      </BrowserRouter>
    </ThemeProvider>
  </ApolloProvider>,
  document.getElementById('root'),
)
