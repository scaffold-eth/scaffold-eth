export default [
  {
    avatar: 'punk5950.png',
    alignment: 'left',
    text: `Ah Ethereum City, it's been a long time ...`
  },
  {
    avatar: 'punk5950.png',
    alignment: 'left',
    text: 'Feels good to be back ...'
  },
  {
    avatar: 'punk5950.png',
    alignment: 'left',
    text: 'Feels like home ...'
  },
  {
    avatar: 'punk5950.png',
    alignment: 'left',
    text: 'I wonder if it is still ruled by the same fractions from back when I left ...'
  },
  {
    avatar: 'punk5950.png',
    alignment: 'left',
    text: 'Maybe I can contact some of my old friends.'
  },
  {
    avatar: 'punk5950.png',
    alignment: 'left',
    text: 'If I can still call them friends.'
  },
  {
    avatar: 'punk5950.png',
    alignment: 'left',
    text: `I'll need to contact them somehow. If I manage to connect to the city network I can maybe send them a message.`,
    choices: [
      {
        id: 'check-for-sites',
        buttonText: 'Search for possible connections'
      }
    ]
  },
  {
    avatar: 'punk5950.png',
    alignment: 'left',
    text: `Oh man, an old go client! This is ancient! Crazy that it survived all these years. Let's see if it still works ...`,
    choices: [
      {
        id: 'check-for-sites',
        buttonText: 'Open wrist terminal'
      }
    ]
  },
  {
    avatar: 'old_gtx.png',
    alignment: 'right',
    text: 'Installing software to connect to adjacent network ...'
  },
  {
    avatar: 'old_gtx.png',
    alignment: 'right',
    text: 'Connection successfull.',
    choices: [
      {
        id: 'continue',
        buttonText: 'Continue'
      }
    ]
  },
  {
    avatar: 'old_gtx.png',
    alignment: 'right',
    text: 'Searching for interfaces... Found <one> compatible interface nearby.',
    choices: [
      {
        id: 'continue',
        buttonText: 'Connect to human compatible interface'
      }
    ]
  },
  {
    avatar: 'old_gtx.png',
    alignment: 'right',
    text: 'Connection to interface established.',
    anchorId: 'cityFundsContract'
  },
  {
    avatar: 'punk5950.png',
    alignment: 'left',
    text: `Hmm, I can't quite put my finger on it, but something about this contract seems off...`
  },
  {
    avatar: 'punk5950.png',
    alignment: 'left',
    text: `Something is off...`
  }
  /*
  {
    avatar: 'old_gtx.png',
    alignment: 'right',
    text: 'Interface loaded!',
    choices: [
      {
        id: 'continue',
        buttonText: 'Open interface'
      }
    ]
  },
  {
    avatar: 'old_gtx.png',
    alignment: 'right',
    text: 'Interact with contract'
  }
  */
]
