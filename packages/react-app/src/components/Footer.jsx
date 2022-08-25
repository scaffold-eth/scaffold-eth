import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import EmailIcon from '@mui/icons-material/Email'
import Logo from './Logo'
import GitHubIcon from '@mui/icons-material/GitHub'
import TwitterIcon from '@mui/icons-material/Twitter'
import LinkedInIcon from '@mui/icons-material/LinkedIn'
import Paper from '@mui/material/Paper'
import Button from '@mui/material/Button'
import makeStyles from '@mui/styles/makeStyles'
import IconButton from '@mui/material/IconButton'
import Grid from '@mui/material/Grid'
import useMediaQuery from '@mui/material/useMediaQuery'

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
    { text: 'Plugins', url: 'https://github.com/ethereum/remix-plugin#readme' },
  ],
  GITHUB: [
    { text: 'Remix', url: 'https://github.com/ethereum/remix-project' },
    { text: 'Plugins', url: 'https://github.com/ethereum/remix-plugin#readme' },
  ],
  COMPANY: [
    { text: 'About', url: '' },
    { text: 'Careers', url: '' },
  ],
}

const useMakeStyles = props => {
  return makeStyles({
    logo: {
      fill: props.fill,
      width: props.width,
      float: props.float,
      marginLeft: props.leftMargin,
    },
  })
}

function Footer() {
  const mobileResponsiveMatch = useMediaQuery('(min-width:600px)')
  const payload = {
    fill: '#2F6DF2',
    width: '45px',
    float: 'left',
    marginRight: 5,
  }
  const useStyles = useMakeStyles(payload)

  return (
    <Paper component={'footer'} sx={{ marginTop: 5 }}>
      <Grid container spacing={0.5} pl={mobileResponsiveMatch ? 10 : 1}>
        <Grid item xs={12} md={3} lg={3} sx={{ marginBottom: mobileResponsiveMatch ? 3 : 0 }}>
          <Logo useStyles={useStyles} />
        </Grid>
        {Object.keys(footerCategories).map(category => (
          <Grid item sx={{ textAlign: 'left' }} xs={6} lg={2}>
            <Typography variant={'h6'} color={'#666666'}>
              {category}
            </Typography>
            {footerCategories[category].map(chilrn => (
              <Box component={'ul'} sx={{ paddingLeft: 0 }} minWidth={170} maxWidth={180}>
                <li style={{ listStyle: 'none', padding: 0, width: 150 }}>
                  <Button variant={'text'} href={chilrn.url} sx={{ padding: 0 }}>
                    <Typography variant={'body1'} color={'#333333'} p={0}>
                      {`${chilrn.text}`.charAt(0).toUpperCase() + chilrn.text.slice(1)}
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
        flexWrap={'nowrap'}
      >
        <Box width={80}></Box>
        <Typography variant={'subtitle2'}>&copy; 2022 Remix. All rights reserved.</Typography>
        <Box mr={5} sx={{ float: 'right' }}>
          <IconButton size={'small'} href={'mailto: remix@ethereum.org'} target={'_blank'} rel={'noreferrer'}>
            <EmailIcon sx={{ color: '#4F4F4F', marginRight: 3, fontSize: 24 }} />
          </IconButton>
          <IconButton
            size={'small'}
            href={'https://github.com/ethereum/remix-project'}
            target={'_blank'}
            rel={'noreferrer'}
          >
            <GitHubIcon sx={{ color: '#4F4F4F', marginRight: 3, fontSize: 24 }} />
          </IconButton>
          <IconButton size={'small'} href={'https://twitter.com/EthereumRemix'} target={'_blank'} rel={'noreferrer'}>
            <TwitterIcon sx={{ color: '#4f4f4f', marginRight: 3, fontSize: 24 }} />
          </IconButton>
          <IconButton
            size={'small'}
            href={'https://www.linkedin.com/company/ethereum-remix/'}
            target={'_blank'}
            rel={'noreferrer'}
          >
            <LinkedInIcon sx={{ color: '#4f4f4f', marginRight: 3, fontSize: 24 }} />
          </IconButton>
          <IconButton size={'small'} href={'https://medium.com/remix-ide'} target={'_blank'} rel={'noreferrer'}>
            M
          </IconButton>
        </Box>
      </Box>
    </Paper>
  )
}

export default Footer
