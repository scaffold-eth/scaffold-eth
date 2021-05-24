export default [
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
        goToDialogAnchor: 'experienced-dev',
        buttonText: `I'm an experienced developer`
      },
      {
        id: 'beginner-dev-select',
        goToDialogAnchor: 'beginner-dev',
        buttonText: `I'm more of a beginner`
      }
    ]
  }
]
