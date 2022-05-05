import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client'
import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import ReactDOM from 'react-dom'
import App from './App'
import './index.css'
import { createTheme, ThemeProvider } from '@mui/material/styles'

const subgraphUri = 'http://localhost:8000/subgraphs/name/scaffold-eth/your-contract'

const client = new ApolloClient({
  uri: subgraphUri,
  cache: new InMemoryCache(),
})

const theme = createTheme()

ReactDOM.render(
  <ApolloProvider client={client}>
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <App subgraphUri={subgraphUri} />
      </BrowserRouter>
    </ThemeProvider>
  </ApolloProvider>,
  document.getElementById('root'),
)
