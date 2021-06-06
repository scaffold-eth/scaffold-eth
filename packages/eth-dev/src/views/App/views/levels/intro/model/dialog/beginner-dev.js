export const DIALOG_PART_ID = 'intro/beginner-dev'

const dialog = [
  {
    dialogPartId: DIALOG_PART_ID,
    avatar: 'punk5950.png',
    alignment: 'left',
    text:
      'Not to worry, not to worry - I got you covered. May I suggest that you head over to your dear friends at cryptozombies.io ?',
    choices: [
      {
        id: 'cryptozombies-io',
        href: 'https://cryptozombies.io',
        buttonText: 'Check out cryptozombies.io'
      }
    ]
  }
]

const enrichDialog = _dialog => {
  return _dialog.map(dialogStep => {
    return { dialogPartId: DIALOG_PART_ID, ...dialogStep }
  })
}

export default enrichDialog(dialog)
