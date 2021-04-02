const setupCodingEnv = [
  {
    avatar: 'old_gtx.png',
    alignment: 'right',
    text: 'Installing software to connect to adjacent network ...'
  },
  {
    avatar: 'old_gtx.png',
    alignment: 'right',
    text: 'Connection successfull. Found <one> compatible interface nearby.',
    choices: [
      {
        id: 'continue',
        buttonText: 'Connect to interface'
      }
    ]
  },
  {
    avatar: 'old_gtx.png',
    alignment: 'right',
    text: 'Connection to interface established.',
    code: `
    contract Clicker {
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
  }
  /*
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
