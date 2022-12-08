import { CardContent } from '@mui/material'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'

export interface InfoCardProps {
  imageSrc: string
}

export default function InfoCard({ imageSrc }: InfoCardProps) {
  return (
    <Card
      sx={{
        // backdropFilter: 'blur(5)',
        background: 'rgba(255,255,255,0.6)',
        boxShadow: '1px 1px 4px 0px rgb(170,170,170)',
        width: 530,
        borderRadius: 5,
        zIndex: 900,
      }}
    >
      <Box sx={{ display: 'flex', height: '100%' }}>
        <img
          style={{ borderRadius: '10px', border: '1px solid #ccc', objectFit: 'cover', marginLeft: 0 }}
          width={200}
          src={imageSrc}
          alt={'Reward description'}
        />
        <Box sx={{ marginLeft: 2 }}>
          <CardContent>
            <Typography align="left">
              This is some text Lorem ipsum dolor sit amet consectetur adipisicing elit. Obcaecati et repudiandae
              reiciendis, molestiae nobis ipsam inventore eaque! Non, consequatur. Suscipit sapiente vel nemo facere
              mollitia consequatur corporis nulla expedita quisquam?
            </Typography>
          </CardContent>
        </Box>
      </Box>
    </Card>
  )
}
