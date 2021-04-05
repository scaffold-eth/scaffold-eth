const setupCodingEnv = [
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
    choices: [
      {
        id: 'continue',
        buttonText: 'Show interface'
      }
    ]
  },
  {
    anchorId: 'cityFundsContract',
    avatar: 'old_gtx.png',
    alignment: 'right',
    text: '',
    code: `
    contract EthereumCityERC20TokenMinter {
      event Click(address sender);

      mapping(address => uint256) public clicks;

      function increment() public {
        clicks[msg.sender]++;
        emit Click(msg.sender);
      }

      function decrement() public {
        clicks[msg.sender]--;
        emit Click(msg.sender);
      }
    }
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
    text: `Hmm, I can't quite put my finger on it, but something about this contract seems off...`
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

export default setupCodingEnv
