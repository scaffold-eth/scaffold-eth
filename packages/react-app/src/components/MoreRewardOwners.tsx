import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { Reward } from '../types/rewardTypes'

export interface MoreRewardOwnersProps {
  rewards?: Reward[]
}

export default function MoreRewardOwners(props: MoreRewardOwnersProps) {
  return (
    <Box>
      <Box>
        <ul>
          <li>
            <Box>
              <Typography>Account</Typography>
            </Box>
          </li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
        </ul>
      </Box>
    </Box>
  )
}
