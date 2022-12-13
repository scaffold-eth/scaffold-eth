import { CardContent } from '@mui/material'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import { ReactNode } from 'react'
import { RewardNames } from '../../types/rewardTypes'

export interface InfoCardProps {
  imageSrc: string
  rewardType: RewardNames
  text: JSX.Element
}

export default function InfoCard({ imageSrc, rewardType, text }: InfoCardProps) {
  return (
    <Card
      sx={{
        background: 'rgba(255,255,255,0.6)',
        boxShadow: '1px 1px 4px 0px rgb(170,170,170)',
        width: 530,
        borderRadius: 5,
        zIndex: 900,
      }}
    >
      <Box sx={{ display: 'flex', height: '100%' }}>
        {rewardType === 'Remixer' ? (
          <img
            style={{ borderRadius: '10px', border: '1px solid #ccc', objectFit: 'cover', marginLeft: 0 }}
            width={200}
            height={241}
            src={imageSrc}
            alt={'Reward description'}
          />
        ) : (
          <img
            style={{ borderRadius: '10px', border: '1px solid #ccc', objectFit: 'cover', marginLeft: 0 }}
            width={200}
            src={imageSrc}
            alt={'Reward description'}
          />
        )}
        <Box sx={{ marginLeft: 2 }}>
          <CardContent>
            <Typography variant="h5" fontWeight={700} color={'#333333'} align={'left'}>
              {rewardType}
            </Typography>
            <Typography align="left" variant="body1" fontWeight={500} color={'#333333'}>
              {text}
            </Typography>
          </CardContent>
        </Box>
      </Box>
    </Card>
  )
}
