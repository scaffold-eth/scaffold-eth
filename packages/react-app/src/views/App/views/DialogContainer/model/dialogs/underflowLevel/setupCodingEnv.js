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
    text: 'Connection to interface established.'
  },
  {
    anchorId: 'cityFundsContract',
    avatar: 'old_gtx.png',
    alignment: 'right',
    skip: true,
    text: '',
    code: `
    contract EthereumCityERC20TokenMinter {
      event Mint(address sender);
      event Burn(address sender);
      event Transfer(address sender, uint256 amount);

      uint256 internal totalSupply;
      uint256 internal claimableSupply;
      mapping(address => uint256) public balanceOf;

      function incrementSupply() public {
        totalSupply++;
        claimableSupply++;
        emit Mint(msg.sender);
      }

      function decrementSupply() public {
        balanceOf[msg.sender]--;
        totalSupply--;
        emit Burn(msg.sender);
      }

      function transfer(uint256 amount) public {
        assert amount <= claimableSupply;
        claimableSupply = 0;
        balanceOf[msg.sender] += claimableSupply;
        emit Transfer(msg.sender, amount);
      }
    }
    `
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

export default setupCodingEnv
