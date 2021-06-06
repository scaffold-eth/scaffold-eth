export const DIALOG_PART_ID = 'intro/experienced-dev'

const dialog = [
  {
    dialogPartId: DIALOG_PART_ID,
    avatar: 'punk5950.png',
    alignment: 'left',
    text: `Cool! For the game to run smoothly you'll need to do the following:`,
    code: `
      # clone the eth-dev branch
      $ git clone -b eth-dev https://github.com/austintgriffith/scaffold-eth.git eth-dev
      $ cd eth-dev

      # start a local ethereum blockchain
      $ yarn chain

      # in second terminal:
      # deploys some smart contracts that will be used throughout the game
      $ yarn deploy
    `
  }
]

const enrichDialog = _dialog => {
  return _dialog.map(dialogStep => {
    return { dialogPartId: DIALOG_PART_ID, ...dialogStep }
  })
}

export default enrichDialog(dialog)
