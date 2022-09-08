import { Box, Card, CardMedia } from '@mui/material'

export default function MintingPageCard({ top }) {
  return (
    <>
      <Box
        sx={{
          padding: '2px',
          color: '#333333',
          borderRadius: 5,
        }}
        maxWidth={350}
      >
        <Card variant={'outlined'} sx={{ borderRadius: 5, marginTop: top }}>
          <CardMedia component={'img'} width={300} image={'./Remixer.png'} alt={'remixer'} />
        </Card>
      </Box>
    </>
  )
}
