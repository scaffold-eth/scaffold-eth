import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client'
import React from 'react'
import { BrowserRouter, Route } from 'react-router-dom'
import ReactDOM from 'react-dom'
import App from './App'
import './index.css'
import { ThemeProvider } from '@mui/material/styles'
import { theme } from './themes/createTheme'
import { CssBaseline } from '@mui/material'
import { QueryClientProvider, QueryClient } from '@tanstack/react-query'

const subgraphUri = 'http://localhost:8000/subgraphs/name/scaffold-eth/your-contract'

const client = new ApolloClient({
  uri: subgraphUri,
  cache: new InMemoryCache(),
})

const queryClient = new QueryClient()

ReactDOM.render(
  <QueryClientProvider client={queryClient}>
    <ApolloProvider client={client}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <BrowserRouter>
          <Route path="/">
            <App />
          </Route>
        </BrowserRouter>
      </ThemeProvider>
    </ApolloProvider>
  </QueryClientProvider>,
  document.getElementById('root'),
)
