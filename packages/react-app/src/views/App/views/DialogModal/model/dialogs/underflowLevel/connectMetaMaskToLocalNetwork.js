const connectMetaMaskToLocalNetwork = [
  {
    avatar: 'old_gtx.png',
    alignment: 'right',
    text: `In Metamask select 'Custom RPC' from the network dropdown list and fill in the following parameters and hit save:`,
    code: `
      # Network Name
      localhost

      # New RPC URL
      http://0.0.0.0:8545

      # Chain ID
      31337
    `,
    choices: [
      {
        id: 'continue',
        buttonText: 'Continue'
      }
    ]
  }
]

export default connectMetaMaskToLocalNetwork
