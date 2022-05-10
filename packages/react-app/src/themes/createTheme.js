import { createTheme } from '@mui/material'

export const theme = createTheme({
  typography: {
    fontFamily: ['Arial', 'Noah', 'Jura', 'Roboto'].join(','),
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: `
        @font-face {
          font-family: 'Arial, Jura, Noah, Roboto';
        }
      `,
    },
  },
})
