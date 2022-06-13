// @ts-nocheck
import React from 'react'
import MuiAlert from '@mui/material/Alert'
import Snackbar from '@mui/material/Snackbar'

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />
})

export default function Toast({ showToast, closeToast, snackBarAction }) {
  return (
    <>
      <Snackbar open={showToast} autoHideDuration={5000} onClose={closeToast} action={snackBarAction}>
        <Alert severity="error" onClose={closeToast}>
          MetaMask is not installed!
        </Alert>
      </Snackbar>
    </>
  )
}
