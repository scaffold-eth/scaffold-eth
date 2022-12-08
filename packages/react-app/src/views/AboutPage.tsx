import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { InfoCard } from '../components'

export default function About() {
  return (
    <>
      <Box sx={{ paddingTop: '76px' }}>
        <h3>About Rewards!</h3>
        <Typography variant="h5">
          Have you ever wondered how you can get a reward? Well you find out how here.
        </Typography>
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
          <InfoCard imageSrc="/Contributor.png" rewardType="Contributor" />
          <InfoCard imageSrc="/Remixer.png" rewardType="Remixer" />
          <InfoCard imageSrc="/UX Champion.png" rewardType="UX Champion" />
          <InfoCard imageSrc="/ReleaseManager.png" rewardType="Release Manager" />
          <InfoCard imageSrc="/BetaTester.png" rewardType="Beta Tester" />
          <InfoCard imageSrc="/DevConnector.png" rewardType="Dev Connector" />
        </Box>
      </Box>
    </>
  )
}
