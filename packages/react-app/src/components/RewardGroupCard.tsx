// @ts-ignore
import React, { useCallback, useEffect, useReducer, useState } from 'react'
import {
  Box,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Skeleton,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  Badge,
} from '@mui/material'
import IconButton from '@mui/material/IconButton'
import SearchIcon from '@mui/icons-material/Search'
import Tooltip from '@mui/material/Tooltip'
import Accordion from '@mui/material/Accordion'
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
      const title = props.event[0].tokenType
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
            <div
              style={{
                display: 'flex',
                justifyContent: 'right',
                alignItems: 'start',
                top: 20,
                position: 'relative',
                zIndex: 50,
              }}
            >
              <Typography
                color={'primary'}
                ml={10}
                width={30}
                height={30}
                fontWeight={'bold'}
                sx={{
                  borderRadius: '50%',
                  backgroundColor: 'white',
                  border: '1px solid primary',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {state.rewardCount}
              </Typography>
            </div>
            <Accordion sx={{ background: '#81a6f7', ':hover': { background: '#1976d2', color: '#fff' } }}>
              <AccordionSummary sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Typography
                  fontWeight={'bold'}
                  color={'white'}
                >{`${props.event[0].tokenType} ${props.event[0].payload}`}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <List>
                  {props.event.map(x => (
                    <ListItem
                      key={x.transactionHash}
                      sx={{
                        marginBottom: 2,
                      }}
                      secondaryAction={
                        <Tooltip title="view transaction" placement={'top-start'}>
                          <IconButton
                            edge="end"
                            size="small"
                            href={`${props.etherscan}${x.transactionHash}`}
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
                        </Tooltip>
                      }
                    >
                      <CopyToClipboard text={x.to} onCopy={handleTooltipOpen}>
                        <Typography
                          variant={'body2'}
                          noWrap={false}
                          fontWeight={400}
                          color={'white'}
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
                          {x.resolvedName !== null
                            ? x.resolvedName
                            : x.to.length === 0
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
