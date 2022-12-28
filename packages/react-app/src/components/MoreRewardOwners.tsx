import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import { Reward } from '../types/rewardTypes'
import SearchIcon from '@mui/icons-material/Search'

export interface MoreRewardOwnersProps {
  rewards?: Reward[]
  etherscan?: string
}

export default function MoreRewardOwners(props: MoreRewardOwnersProps) {
  return (
    <Box>
      <Box>
        <ul>
          {props.rewards?.map(reward => (
            <li>
              <Box>
                <Typography>Account</Typography>
                <Box>
                  <IconButton
                    edge="end"
                    size="small"
                    href={`${props.etherscan}${reward.transactionHash}`}
                    target="_blank"
                    rel="noreferrer"
                    sx={{
                      background: '#81a6f7',
                      border: '2px solid white',
                      color: '#fff',
                      ':hover': {
                        background: '#1976d2',
                        color: '#fff',
                        border: '2px solid pink',
                      },
                    }}
                  >
                    <SearchIcon />
                  </IconButton>
                </Box>
              </Box>
            </li>
          ))}
        </ul>
      </Box>
    </Box>
  )
}
