import { extendTheme } from '@chakra-ui/react'
import "@fontsource/open-sans/400.css"
import "@fontsource/open-sans/600.css"
import "@fontsource/open-sans/700.css"

export const theme = extendTheme({
  fonts: {
    heading: "Open Sans",
    body: "Open Sans",
  },
  components: {
    Button: {
      baseStyle: {
        position: 'relative',
        _focus: { boxShadow: '0 0 0 3px rgba(0, 0, 0, 0.2)' },
      },
      variants: {
        outline: {
          _hover: {
            background: 'var(--chakra-colors-gray-100)',
            boxShadow: '0 0 0 1px rgba(0, 0, 0, 1)'
          },
        },
        white: {
          color: '#000',
          background: '#FFF',
          _hover: {
            background: 'var(--chakra-colors-gray-100)',
          },
        },
        'white-selected': {
          color: '#000',
          background: '#FFF',
          _after: {
            content: '""',
            position: 'absolute',
            left: '50%',
            bottom: '0',
            transform: 'translateX(-50%)',
            width: '.7rem',
            height: '.15rem',
            background: '#000',
          },
        },
        black: {
          color: '#FFF',
          background: '#000',
        },
        'black-selected': {
          color: '#FFF',
          background: '#000',
          _after: {
            content: '""',
            position: 'absolute',
            left: '50%',
            bottom: '0',
            transform: 'translateX(-50%)',
            width: '.7rem',
            height: '.15rem',
            background: '#FFF',
          },
        },
        'gray-selected': {
          color: '#000',
          background: 'var(--chakra-colors-gray-100)',
          _after: {
            content: '""',
            position: 'absolute',
            left: '50%',
            bottom: '0',
            transform: 'translateX(-50%)',
            width: '.7rem',
            height: '.15rem',
            background: '#000',
          },
        },
        'press-down': {
          color: '#000',
          border: '0.15rem solid #000',
          background: '#fff',
          overflow: 'hidden',
          boxShadow: '0 3px 0 0 #000',
          transition: 'unset',
          _after: {
            content: '""',
            position: 'absolute',
            width: '100%',
            height: '100%',
            top: '0',
            left: '0',
            transform: 'scale(0)',
            transition: 'transform 0.3s ease-in',
          },
          _hover: {
            background: '#f8f8f8',
          },
          _active: {
            top: '3px',
            boxShadow: 'none',
          },
        },
      },
    },
    CloseButton: {
      variants: {
        bordered: {
          border: '.15rem solid #000',
          _focus: {
            boxShadow: '0 0 0 3px rgba(0, 0, 0, 0.2)'
          }
        }
      }
    },
    Tooltip: {
      baseStyle: {
        px: '16px',
        py: '10px'
      },
      variants: {
        black: {
          bg: "#000",
        }
      }
    }
  },
})
