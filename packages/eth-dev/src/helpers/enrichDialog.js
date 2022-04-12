const enrichDialog = (dialog, DIALOG_PART_ID) => {
  return dialog.map(dialogStep => {
    return {
      dialogPathId: DIALOG_PART_ID,
      ...dialogStep
    }
  })
}

export default enrichDialog
