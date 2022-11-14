// @ts-ignore
import React, { Fragment, useCallback, useEffect, useReducer, useState } from 'react'
import {
  Box,
  Button,
  Card,
  CardActions,
  CardMedia,
  CardContent,
  Typography,
  Skeleton,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemText,
} from '@mui/material'
import Accordion from '@mui/material/Accordion'
import InfoIcon from '@mui/icons-material/Info'
import { ethers } from 'ethers'
import multihash from 'multihashes'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import Snackbar from '@mui/material/Snackbar'
import MuiAlert from '@mui/material/Alert'
import { CopyToClipboard } from 'react-copy-to-clipboard'

export const toBase58 = contentHash => {
  let hex = contentHash.substring(2)
  let buf = multihash.fromHexString(hex)
  return multihash.toB58String(buf)
}

const Notification = React.forwardRef(function Alert(props, ref) {
  // @ts-ignore
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />
})

export default function RewardGroupCard(props) {
  const [state, setState] = useState({
    title: '',
    src: '',
    rewardCount: 0,
    tokenType: '',
    payload: '',
  })
  const [open, setOpen] = useState(false)
  // @ts-ignore
  const [hoverActive, setHoverActive] = useReducer(previous => !previous, false)
  const handleTooltipClose = () => {
    setOpen(false)
  }

  const handleTooltipOpen = () => {
    setOpen(true)
  }

  const run = useCallback(async () => {
    try {
      const tos = []
      props.event.forEach(x => {
        tos.push(ethers.utils.hexZeroPad(ethers.utils.hexStripZeros(x.to), 20))
      })
      let title = props.event[0].tokenType
      const tokenType = props.event[0].tokenType
      const payload = props.event[0].payload
      const src = 'https://remix-project.mypinata.cloud/ipfs/' + toBase58(props.event[0].hash)
      const rewardCount = props.event.length
      setState({ title, src, rewardCount, tokenType, payload })
    } catch (error) {
      console.error(error)
    }
  }, [props])
  useEffect(() => {
    try {
      run()
    } catch (error) {
      console.log({ error })
    }
  }, [run])
  return (
    <>
      <Box
        sx={{
          position: 'relative',
          padding: '2px',
          color: '#333333',
          borderRadius: 5,
          boxShadow: '1px 1px 4px 0px rgb(170,170,170)',
          transition: 'transform 0.2s',
          ':hover': {
            transform: 'scale(1.05)',
          },
        }}
        maxWidth={310}
      >
        <Card variant={'outlined'} sx={{ borderRadius: 5, zIndex: 10 }}>
          {state.src.length < 55 ? (
            <>
              <Skeleton variant={'rectangular'} width={300} height={350}>
                <CardMedia component={'img'} width={200} image={state.src} alt={'nftimage'} />
              </Skeleton>
            </>
          ) : (
            <CardMedia component={'img'} width={200} image={state.src} alt={'nftimage'} />
          )}
          <CardContent
            sx={{
              background:
                'linear-gradient(90deg, #d4def4, #d9dff6, #dee1f7, #e3e2f9, #e8e4fa, #ede5fb, #f1e6fb, #f6e8fc)',
            }}
          >
            <Accordion>
              <AccordionSummary>
                <Typography> {props.event[0].tokenType}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <List>
                  {props.event.map(x => (
                    <ListItem key={x.transactionHash}>
                      <CopyToClipboard text={x.to} onCopy={handleTooltipOpen}>
                        <Typography
                          variant={'body2'}
                          noWrap={false}
                          fontWeight={400}
                          color={'#333333'}
                          onMouseOver={() => setHoverActive()}
                          onMouseOut={() => setHoverActive()}
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            ':hover': { cursor: 'pointer' },
                          }}
                          component={'span'}
                        >
                          {x.to.length === 0
                            ? null
                            : x.to.length > 20
                            ? `${x.to.substring(0, 7)}...${x.to.substring(x.to.length - 7)}`
                            : state.title}
                          <ContentCopyIcon fontSize="inherit" sx={{ marginLeft: 0.5 }} />
                        </Typography>
                      </CopyToClipboard>
                    </ListItem>
                  ))}
                </List>
              </AccordionDetails>
            </Accordion>
          </CardContent>
        </Card>
      </Box>
      <Snackbar open={open} autoHideDuration={1200} onClose={handleTooltipClose}>
        <Notification
          // @ts-ignore
          severity={'info'}
        >
          {'Address copied!'}
        </Notification>
      </Snackbar>
    </>
  )
}

// RewardGroupCard.propTypes = {
//   // @ts-ignore
//   event: PropTypes.objectOf(
//     PropTypes.arrayOf(
//       PropTypes.shape({
//         hash: PropTypes.string,
//         id: PropTypes.string,
//         payload: PropTypes.string,
//         to: PropTypes.string,
//         tokenType: PropTypes.string,
//         transactionHash: PropTypes.string,
//       }),
//     ),
//   ),
// }
