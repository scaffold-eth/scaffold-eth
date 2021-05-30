import { DIALOG_PART_ID as beginnerDev } from './beginner-dev'
import { DIALOG_PART_ID as experiencedDev } from './experienced-dev'

export const DIALOG_PART_ID = 'intro/start'

const dialog = [
  {
    avatar: 'punk5950.png',
    alignment: 'left',
    text: 'Welcome!'
  },
  {
    avatar: 'punk5950.png',
    alignment: 'left',
    text:
      'You are about to embark on a journey into the development world of the Ethereum blockchain.'
  },
  {
    avatar: 'punk5950.png',
    alignment: 'left',
    text:
      'This game is targeted towards more experienced developer (developer in general, not Ethereum specific).',
    choices: [
      {
        id: 'experienced-dev-select',
        jumpToDialogPartId: experiencedDev,
        buttonText: `I'm an experienced developer`
      },
      {
        id: 'beginner-dev-select',
        jumpToDialogPartId: beginnerDev,
        buttonText: `I'm more of a beginner`
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
