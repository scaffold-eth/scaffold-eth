import { Box, Card, CardMedia } from '@mui/material'

export default function MintingPageCard({ top }) {
  return (
    <>
      <Box
        sx={{
          position: 'relative',
          // background:
          //   'linear-gradient(to right, #d4def4, #d9dff6, #dee1f7, #e3e2f9, #e8e4fa, #ede5fb, #f1e6fb, #f6e8fc)',
          padding: '2px',
          color: '#333333',
          borderRadius: 5,
        }}
        maxWidth={410}
      >
        <Card variant={'outlined'} sx={{ borderRadius: 5, zIndex: 50, marginTop: top }}>
          <CardMedia component={'img'} width={300} image={'/MyRemixer.png'} alt={'remixer'} />
        </Card>
      </Box>
    </>
  )
}
