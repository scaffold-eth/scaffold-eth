const enrichDialog = (dialog, DIALOG_PATH_ID, alternativeDialogBranches) => {
  return dialog.map(dialogStep => {
    return {
      dialogPathId: DIALOG_PATH_ID,
      alternativeDialogBranches,
      ...dialogStep
    }
  })
}

export { enrichDialog }
