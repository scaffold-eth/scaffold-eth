import Box from '@mui/material/Box'
import { InfoCard } from '../components'

export default function About() {
  return (
    <>
      <Box sx={{ paddingTop: '76px' }}>
        <h3>About Rewards!</h3>
        <Box
          sx={{
            marginTop: '176px',
            height: 'auto',
            background:
              'linear-gradient(90deg, #f6e8fc, #f1e6fb, #ede5fb, #e8e4fa, #e3e2f9, #dee1f7, #d9dff6, #d4def4)',
          }}
          mt={15}
          p={5}
          display={'flex'}
          flexWrap={'wrap'}
          gap={3}
        >
          <InfoCard imageSrc="/Contributor.png" />
          <InfoCard imageSrc="/Remixer.png" />
          <InfoCard imageSrc="/UX Champion.png" />
          <InfoCard imageSrc="/ReleaseManager.png" />
          <InfoCard imageSrc="/BetaTester.png" />
          <InfoCard imageSrc="/DevConnector.png" />
        </Box>
      </Box>
    </>
  )
}
