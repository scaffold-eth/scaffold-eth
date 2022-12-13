import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import { InfoCard } from '../components'
import { RewardNames } from '../types/rewardTypes'

const inforCardPayload: { imageSrc: string; rewardType: RewardNames; text: JSX.Element }[] = [
  {
    imageSrc: '/Contributor.png',
    rewardType: 'Contributor',
    text: <p>Contribute a pull request to the Remix codebase. When it's merged, you earn the Contributor</p>,
  },
  {
    imageSrc: '/Remixer.png',
    rewardType: 'Remixer',
    text: (
      <p>
        Our base reward. When you earn any of the other rewards, you gain the ability to mint Remixer to any wallet of
        your choice.
      </p>
    ),
  },
  {
    imageSrc: '/BetaTester.png',
    rewardType: 'Beta Tester',
    text: (
      <p>
        Beta test any release of Remix IDE and you earn the Beta Tester for that version.
        <br />
        <Button variant="outlined" sx={{ marginTop: 3 }} href="#" color={'inherit'}>
          Here is how
        </Button>
      </p>
    ),
  },
  {
    imageSrc: '/DevConnector.png',
    rewardType: 'Dev Connector',
    text: (
      <p>
        These are special issue rewards for participation in one of the several select events during the year.
        <Button variant="outlined" sx={{ marginTop: 3 }} color={'inherit'} href="#">
          Event schedule
        </Button>
      </p>
    ),
  },
  {
    imageSrc: '/UX Champion.png',
    rewardType: 'UX Champion',
    text: <p>If you helpf us learn more about the user experience from your perspective, you earn the UX Chamion.</p>,
  },
]

export default function About() {
  return (
    <>
      <Box sx={{ paddingTop: '76px' }}>
        <Typography variant="h3" fontWeight={700} fontFamily={'Noah'} color={'#333333'} marginBottom={5} align="left">
          About Rewards
        </Typography>
        <Typography variant="h5" fontWeight={400} marginBottom={5} color={'#333333'} align="left">
          Have you ever wondered how you can get a reward? Well you find out how here.
        </Typography>
        <Box
          sx={{
            height: 'auto',
            background:
              'linear-gradient(90deg, #f6e8fc, #f1e6fb, #ede5fb, #e8e4fa, #e3e2f9, #dee1f7, #d9dff6, #d4def4)',
          }}
          p={5}
          display={'flex'}
          justifyContent={'center'}
          alignItems={'flex-end'}
          flexWrap={'wrap'}
          gap={7}
        >
          {inforCardPayload && inforCardPayload.length
            ? inforCardPayload
                .sort((x, y) => {
                  const first = x.rewardType.toUpperCase()
                  const second = y.rewardType.toUpperCase()
                  return first < second ? -1 : first > second ? 1 : 0
                })
                .map(card => <InfoCard imageSrc={card.imageSrc} rewardType={card.rewardType} text={card.text} />)
            : null}
        </Box>
      </Box>
    </>
  )
}
