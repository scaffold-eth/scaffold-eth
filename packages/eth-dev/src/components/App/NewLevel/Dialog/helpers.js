const enrichDialog = (dialog, DIALOG_PATH_ID) => {
  return dialog.map(dialogStep => {
    return {
      dialogPathId: DIALOG_PATH_ID,
      ...dialogStep
    }
  })
}

export { enrichDialog }
