const setupCodingEnv = [
  {
    avatar: 'old_gtx.png',
    alignment: 'right',
    text: 'Installing software to connect to adjacent network ...'
  },
  {
    avatar: 'old_gtx.png',
    alignment: 'right',
    text: 'Open a terminal and run the following instructions:',
    code: `
      $ git clone https://github.com/austintgriffith/scaffold-eth.git

      $ cd scaffold-eth

      $ git checkout clicker

      $ yarn install

      $ yarn start
    `,
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
    text: 'Open 2 additional terminals inside scaffold-eth and run the following instructions:',
    code: `
      # terminal 1
      $ cd scaffold-eth
      $ yarn chain

      # terminal 2
      $ cd scaffold-eth
      $ yarn deploy
    `,
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
    text: 'Checking integrity of MetaMask module...',
    choices: [
      {
        id: 'metamask-not-installed',
        buttonText: 'What is MetaMask?',
        goToDialog: 'installMetaMask'
      },
      {
        id: 'metamask-installed',
        buttonText: 'I have MetaMask installed',
        goToDialog: 'connectMetaMaskToLocalNetwork'
      }
    ]
  },
  {
    avatar: 'old_gtx.png',
    alignment: 'right',
    text: 'Loading human compatible interface...'
  },
  {
    avatar: 'old_gtx.png',
    alignment: 'right',
    text: 'Interface loaded!',
    choices: [
      {
        id: 'open-interface',
        buttonText: 'Open interface at http://localhost:3000'
      }
    ]
  },
  {
    avatar: 'punk5950.png',
    alignment: 'left',
    text: `
      Looks like this is one of the old city token contracts.
      What is it doing out here?
    `
  }
]

export default setupCodingEnv
