// @ts-ignore
import React, { useCallback, useEffect, useReducer, useState } from 'react'
import { Box, Card, CardMedia, CardContent, Typography, Skeleton, AccordionSummary } from '@mui/material'
import Accordion from '@mui/material/Accordion'
// @ts-ignore
import multihash from 'multihashes'
import Snackbar from '@mui/material/Snackbar'
import MuiAlert, { AlertProps } from '@mui/material/Alert'
import AccordionInnards from './AccordionInnards'

export const toBase58 = (contentHash: any) => {
  let hex = contentHash.substring(2)
  let buf = multihash.fromHexString(hex)
  return multihash.toB58String(buf)
}

const Notification = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(props, ref) {
  // @ts-ignore
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />
})

export default function RewardGroupCard(props: any) {
  const [state, setState] = useState({
    title: '',
    src: '',
    rewardCount: 0,
    tokenType: '',
    payload: '',
  })
  const [open, setOpen] = useState(false)
  // @ts-ignore
  const [, setHoverActive] = useReducer(previous => !previous, false)
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
      const src = 'https://ipfs.io/ipfs/' + toBase58(props.event[0].hash)

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
    <Box
      sx={{
        position: 'relative',
        padding: '2px',
        paddingBottom: 0,
        color: '#333333',
        borderRadius: 5,
        boxShadow: '1px 1px 4px 0px rgb(170,170,170)',
        transition: 'transform 0.2s',
        ':hover': {
          transform: 'scale(1.05)',
        },
        zIndex: 999,
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
        ) : state.tokenType === 'Remixer' ? (
          <CardMedia component={'img'} width={200} height={360} image={state.src} alt={'Remixer NFT'} />
        ) : (
          <CardMedia component={'img'} width={200} image={state.src} alt={'nftimage'} />
        )}
        <CardContent
          sx={{
            background:
              'linear-gradient(90deg, #d4def4, #d9dff6, #dee1f7, #e3e2f9, #e8e4fa, #ede5fb, #f1e6fb, #f6e8fc)',
            paddingTop: '1px',
            paddingBottom: '5px !important',
            paddingRight: '2px',
            paddingLeft: '2px',
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
          <Accordion
            sx={{
              background: '#81a6f7',
              ':hover': { background: '#1976d2', color: '#fff' },
              borderBottomLeftRadius: '15px !important',
              borderBottomRightRadius: '15px !important',
              paddingBottom: '5px',
            }}
          >
            <AccordionSummary sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <Typography
                fontWeight={'bold'}
                color={'white'}
              >{`${props.event[0].tokenType} ${props.event[0].payload}`}</Typography>
            </AccordionSummary>
            <AccordionInnards
              event={props.event}
              handleTooltipClose={handleTooltipClose}
              handleTooltipOpen={handleTooltipOpen}
              open={open}
              setHoverActive={setHoverActive}
              state={state}
              etherscan={props.etherscan}
            />
          </Accordion>
        </CardContent>
      </Card>
      <Snackbar open={open} autoHideDuration={1200} onClose={handleTooltipClose}>
        <Notification
          // @ts-ignore
          severity={'info'}
        >
          {'Address copied!'}
        </Notification>
      </Snackbar>
    </Box>
  )
}
