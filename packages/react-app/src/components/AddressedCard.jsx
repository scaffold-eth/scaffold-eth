// import React from 'react'

// export function AddressedCard({ badges }) {
//   return (
//     <>
//       <div style={{ flexWrap: 'wrap', display: 'flex', width: '100%', justifyContent: 'flex-start' }}>
//         <div>
//           {badges.map(badge => {
//             const src = 'https://ipfs.io/ipfs/' + badge.decodedIpfsHash
//             return (
//               <Card style={{ margin: '12px', width: '500px' }}>
//                 {badge.tokenType} {badge.payload}
//                 <img width={200} src={src}></img>
//               </Card>
//             )
//           })}
//         </div>
//       </div>
//       <Box
//         sx={{
//           maxWidth: '255px',
//           // padding: '1rem',
//           position: 'relative',
//           background:
//             'linear-gradient(to right, #d4def4, #d9dff6, #dee1f7, #e3e2f9, #e8e4fa, #ede5fb, #f1e6fb, #f6e8fc)',
//           padding: '2px',
//         }}
//       >
//         <Card sx={{ width: '250px' }} variant={'outlined'} zIndex={10}>
//           <CardMedia component={'img'} width={150} image={src} alt={'nftimage'} />
//           <CardContent
//             sx={{
//               background:
//                 'linear-gradient(90deg, #d4def4, #d9dff6, #dee1f7, #e3e2f9, #e8e4fa, #ede5fb, #f1e6fb, #f6e8fc)',
//             }}
//           >
//             <Typography>{'Owner'}</Typography>
//             <Typography variant={'caption'} noWrap={false} fontSize={9} fontWeight={400}>
//               {title}
//             </Typography>
//             <Typography variant={'body2'} fontWeight={400}>
//               {event.tokenType} {event.payload}
//             </Typography>
//           </CardContent>
//           <CardActions
//             disableSpacing
//             sx={{
//               background:
//                 'linear-gradient(90deg, #d4def4, #d9dff6, #dee1f7, #e3e2f9, #e8e4fa, #ede5fb, #f1e6fb, #f6e8fc)',
//             }}
//           >
//             <Button
//               variant={'contained'}
//               fullWidth
//               href={txLink}
//               target="_blank"
//               rel="noreferrer"
//               sx={{ background: '#81a6f7', ':hover': { background: '#81a6f7', color: '#fff' } }}
//             >
//               <Typography variant={'button'}>View Transaction</Typography>
//             </Button>
//           </CardActions>
//         </Card>
//       </Box>
//     </>
//   )
// }
