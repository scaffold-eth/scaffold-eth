import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import Logo from './Logo'

function Footer() {
  return (
    <>
      <Paper
        style={{
          position: 'sticky',
          bottom: 0,
          border: '2px solid #fff',
          background: '#f8f9fa!',
          color: '#ccc',
          width: '100vw',
          height: 192,
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <Box>
          <Logo showLogoText={false} />
        </Box>
        <Box>
          <Typography sx={{ color: 'whitesmoke' }}>Docs</Typography>
        </Box>
        <Box></Box>
        <Box></Box>
        <Box></Box>
      </Paper>
    </>
  )
}

export default Footer
