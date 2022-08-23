import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import EmailIcon from '@mui/icons-material/Email'
import Logo from './Logo'
import GitHubIcon from '@mui/icons-material/GitHub'
import TwitterIcon from '@mui/icons-material/Twitter'
import LinkedInIcon from '@mui/icons-material/LinkedIn'
import Paper from '@mui/material/Paper'
import Button from '@mui/material/Button'

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

function Footer() {
  return (
    // <>
    <Paper component={'footer'}>
      <Box display={'flex'} justifyContent={'space-between'}>
        <Box>
          <Logo />
        </Box>
        {Object.keys(footerCategories).map(category => (
          <Box display={'flex'} flexDirection={'column'} justifyContent={'left'}>
            <Typography variant={'subtitle1'} color={'#666666'} sx={{ textAlign: 'left' }}>
              {category}
            </Typography>
            {footerCategories[category].map(chilrn => (
              <Button variant={'text'} sx={{ justifyContent: 'left' }} href={chilrn.url}>
                <Typography variant={'subtitle2'} color={'#333333'} sx={{ textAlign: 'left' }}>
                  {chilrn.text}
                </Typography>
              </Button>
            ))}
          </Box>
        ))}
        <Box display={'flex'}>
          <EmailIcon sx={{ color: '#4F4F4F' }} />
          <GitHubIcon sx={{ color: '#4F4F4F' }} />
          <TwitterIcon sx={{ color: '#4f4f4f' }} />
          <LinkedInIcon sx={{ color: '#4f4f4f' }} />
        </Box>
      </Box>
      <Box
        borderTop={'1px solid #EAEAEA'}
        display={'block'}
        sx={{ marginTop: 5, height: 66 }}
        p={5}
        alignItems={'center'}
      >
        <Typography variant={'subtitle2'}>&copy; 2022 Remix. All rights reserved.</Typography>
      </Box>
    </Paper>
  )
}

export default Footer
