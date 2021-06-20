export const prepareDialog = dialog => {
  // add a visibleToUser flag to all dialog steps
  // the flag is used to track which paths the user chose
  // and which parts of the dialog should be rendered
  return dialog.map((dialogStep, index) => {
    // skip the first dialog step as it should always be shown
    const isFirstDialogStep = index === 0
    dialogStep.visibleToUser = isFirstDialogStep
    return dialogStep
  })
}
