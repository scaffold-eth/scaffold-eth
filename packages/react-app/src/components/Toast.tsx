// @ts-nocheck
import React from 'react'
import MuiAlert, { AlertProps } from '@mui/material/Alert'
import Snackbar from '@mui/material/Snackbar'

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />
})

export default function Toast({ showToast, closeToast, snackBarAction, message }) {
  return (
    <>
      <Snackbar open={showToast} autoHideDuration={5000} onClose={closeToast} action={snackBarAction}>
        <Alert severity="error" onClose={closeToast}>
          {message}
        </Alert>
      </Snackbar>
    </>
  )
}
