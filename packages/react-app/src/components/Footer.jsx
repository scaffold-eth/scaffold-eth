import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import EmailIcon from '@mui/icons-material/Email'
import Logo from './Logo'
import GitHubIcon from '@mui/icons-material/GitHub'
import TwitterIcon from '@mui/icons-material/Twitter'
import LinkedInIcon from '@mui/icons-material/LinkedIn'
import Paper from '@mui/material/Paper'
import Button from '@mui/material/Button'
import { useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import makeStyles from '@mui/styles/makeStyles'
import IconButton from '@mui/material/IconButton'
import Grid from '@mui/material/Grid'

const footerCategories = {
  PRODUCTS: [
    { text: 'Online IDE', url: 'https://remix.ethereum.org/' },
    { text: 'Desktop App', url: 'https://github.com/ethereum/remix-desktop/releases' },
    { text: 'Ethereum Remix', url: '' },
    { text: 'RemixD', url: '' },
  ],
  DOCUMENTATION: [
    { text: 'Remix', url: 'https://remix-ide.readthedocs.io/en/latest/' },
    { text: 'Solidity', url: 'https://docs.soliditylang.org/' },
    { text: 'Remix Plugin Engine', url: 'https://github.com/ethereum/remix-plugin#readme' },
  ],
  GITHUB: [
    { text: 'Remix', url: 'https://github.com/ethereum/remix-project' },
    { text: 'Remix Plugin Engine', url: 'https://github.com/ethereum/remix-plugin#readme' },
  ],
}
const useStyles = makeStyles({
  logo: {
    fill: '#2F6DF2', //'#81a6f7',
    width: '45px',
    float: 'left',
    marginLeft: 45,
    marginRight: 5,
  },
})

function Footer() {
  const theme = useTheme()
  const mobile400 = useMediaQuery(theme.breakpoints.between('sm', 'md'))
  const mobile900 = useMediaQuery('(min-width:900px)')
  const mobileResponsiveMatch = useMediaQuery('(min-width:600px)')
  return (
    <Paper component={'footer'} sx={{ marginTop: 5 }}>
      <Grid container spacing={10}>
        <Grid item xs={12} md={3} lg={3}>
          <Logo useStyles={useStyles} />
        </Grid>
        {Object.keys(footerCategories).map(category => (
          <Grid item sx={{ textAlign: 'left' }} xs={6}>
            <Typography variant={'h6'} color={'#666666'}>
              {category}
            </Typography>
            {footerCategories[category].map(chilrn => (
              <Box component={'ul'} sx={{ paddingLeft: 0 }}>
                <li style={{ listStyle: 'none' }}>
                  <Button variant={'text'} href={chilrn.url}>
                    <Typography variant={'subtitle1'} color={'#333333'}>
                      {chilrn.text}
                    </Typography>
                  </Button>
                </li>
              </Box>
            ))}
          </Grid>
        ))}
      </Grid>
      <Box
        borderTop={'1px solid #EAEAEA'}
        display={'flex'}
        sx={{ marginTop: 5, height: 66 }}
        p={5}
        justifyContent={'space-between'}
        alignItems={'center'}
      >
        <Box width={80}></Box>
        <Typography variant={'subtitle2'}>&copy; 2022 Remix. All rights reserved.</Typography>
        <Box mr={15} sx={{ float: 'right' }}>
          <IconButton size={'small'}>
            <EmailIcon sx={{ color: '#4F4F4F', marginRight: 5, fontSize: 24 }} />
          </IconButton>
          <IconButton size={'small'}>
            <GitHubIcon sx={{ color: '#4F4F4F', marginRight: 5, fontSize: 24 }} />
          </IconButton>
          <IconButton size={'small'}>
            <TwitterIcon sx={{ color: '#4f4f4f', marginRight: 5, fontSize: 24 }} />
          </IconButton>
          <IconButton size={'small'}>
            <LinkedInIcon sx={{ color: '#4f4f4f', marginRight: 5, fontSize: 24 }} />
          </IconButton>
        </Box>
      </Box>
    </Paper>
  )
}

export default Footer
