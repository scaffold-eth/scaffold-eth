import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import EmailIcon from '@mui/icons-material/Email'
import Logo from './Logo'
import GitHubIcon from '@mui/icons-material/GitHub'
import TwitterIcon from '@mui/icons-material/Twitter'

const footerCategories = {
  PRODUCTS: ['Online IDE', 'Desktop App', 'Ethereum Remix', 'RemixD'],
  GITHUB: ['Solidity', 'Remix', 'Plugins'],
  CONTACT: ['Remix', 'Remix IDE', 'Plugins', 'Libraries'],
}

function Footer() {
  return (
    // <>
    <Box component={'footer'}>
      <Box display={'flex'} justifyContent={'space-between'}>
        <Box>
          <Logo showLogoText={false} />
        </Box>
        {Object.keys(footerCategories).map(category => (
          <Box display={'flex'} flexDirection={'column'} justifyContent={'left'}>
            <Typography variant={'subtitle1'} color={'#666666'} sx={{ textAlign: 'left' }}>
              {category}
            </Typography>
            {footerCategories[category].map(chilrn => (
              <>
                <Typography variant={'subtitle2'} color={'#333333'} sx={{ textAlign: 'left' }}>
                  {chilrn}
                </Typography>
              </>
            ))}
          </Box>
        ))}
        <Box display={'flex'}>
          <EmailIcon sx={{ color: '#4F4F4F' }} />
          <GitHubIcon sx={{ color: '#4F4F4F' }} />
          <TwitterIcon sx={{ color: '#4f4f4f' }} />
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
    </Box>
  )
}

export default Footer
