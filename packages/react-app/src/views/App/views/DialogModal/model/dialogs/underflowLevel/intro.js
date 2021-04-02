const intro = [
  {
    avatar: 'punk5950.png',
    alignment: 'left',
    text: `Ah Ethereum city, it's been a long time...`
  },
  {
    avatar: 'punk5950.png',
    alignment: 'left',
    text: 'Feels good to be back...'
  },
  {
    avatar: 'punk5950.png',
    alignment: 'left',
    text: 'Feels like home...'
  },
  {
    avatar: 'punk5950.png',
    alignment: 'left',
    text: 'I wonder if it is still ruled by the same fractions from back when I left...'
  },
  {
    avatar: 'punk5950.png',
    alignment: 'left',
    text: 'Maybe I can contact some of my old ... acquaintances.'
  },
  {
    avatar: 'punk5950.png',
    alignment: 'left',
    text: `I'll need to connect to the city network.`,
    choices: [
      {
        id: 'check-for-sites',
        buttonText: 'Check for possible connection sites'
      }
    ]
  },
  {
    avatar: 'punk5950.png',
    alignment: 'left',
    text: `Oh look, an old go client! Oh man, this is ancient! Let's see if it still works ...`,
    choices: [
      {
        id: 'check-for-sites',
        buttonText: 'Open wrist terminal',
        goToDialog: 'setupCodingEnv'
      }
    ]
  }
]

export default intro
