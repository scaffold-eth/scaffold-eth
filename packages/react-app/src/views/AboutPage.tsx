import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import { InfoCard } from '../components'
import { RewardNames } from '../types/rewardTypes'

const inforCardPayload: { imageSrc: string; rewardType: RewardNames; text: JSX.Element }[] = [
  {
    imageSrc: '/Contributor.png',
    rewardType: 'Contributor',
    text: <p>Contribute a pull request to the Remix codebase. When it's merged, you earn the Contributor.</p>,
  },
  {
    imageSrc: '/Remixer.png',
    rewardType: 'Remixer',
    text: (
      <p>
        The Remixer is our base reward. When you earn any of the other rewards, you gain the ability to mint a Remixer
        to a wallet of your choice.
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
        <Button
          variant="contained"
          sx={{ background: '#81a6f7', ':hover': { background: '#1976d2', color: '#fff' }, marginTop: 3 }}
          href=" https://docs.google.com/forms/d/e/1FAIpQLSd0WsJnKbeJo-BGrnf7WijxAdmE4PnC_Z4M0IApbBfHLHZdsQ/viewform"
          target={'_blank'}
        >
          Here's How
        </Button>
      </p>
    ),
  },
  {
    imageSrc: '/DevConnector.png',
    rewardType: 'Specials',
    text: (
      <p>
        These are special issue rewards for participation in one of several annual Ethereum events.
        <br />
        <Button
          variant="contained"
          sx={{ background: '#81a6f7', ':hover': { background: '#1976d2', color: '#fff' }, marginTop: 3 }}
          href="https://remix-project.org/#events"
          target={'_blank'}
        >
          Event schedule
        </Button>
      </p>
    ),
  },
  {
    imageSrc: '/UX Champion.png',
    rewardType: 'UX Champion',
    text: <p>When you help us improve the Remix user experience, you earn the UX Champion.</p>,
  },
]

export default function About() {
  return (
    <>
      <Box sx={{ paddingTop: '76px' }}>
        <Typography
          variant="h3"
          fontWeight={700}
          fontFamily={'Noah'}
          color={'#333333'}
          marginBottom={5}
          align="left"
          paddingLeft={7}
        >
          About Rewards
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
