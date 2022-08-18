import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Logo from './Logo'

const footerCategories = {
  PRODUCTS: ['Online IDE', 'Desktop App', 'Ethereum Remix', 'RemixD'],
  GITHUB: ['Solidity', 'Remix', 'Plugins'],
  CONTACT: ['Remix', 'Remix IDE', 'Plugins', 'Libraries'],
}

function Footer() {
  return (
    // <>
    <Box component={'footer'}>
      <Box  display={'flex'} justifyContent={'space-between'}>
        <Box>
        <Logo showLogoText={false} />
      </Box>
      {Object.keys(footerCategories).map(category => (
        <Box display={'flex'} flexDirection={'column'} justifyContent={'left'}>
          <Typography variant={'h6'} color={'#666666'} sx={{ textAlign: 'left' }}>
            {category}
          </Typography>
          {footerCategories[category].map(chilrn => (
            <>
              <Typography variant={'h6'} color={'#333333'} sx={{ textAlign: 'left' }}>
                {chilrn}
              </Typography>
            </>
          ))}
        </Box>
      ))}
      </Box>
      <Box borderTop={'1px solid #ccc'} display={'block'}>
        <Typography variant={'subtitle2'}>2022 Remix. All rights reserved.</Typography>
      </Box>
    </Box>
  )
}

export default Footer
