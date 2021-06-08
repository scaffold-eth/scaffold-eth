module.exports = {
  1: {
    contracts: {
      DAI: {
        address: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
        abi: [
          {
            inputs: [
              {
                internalType: "uint256",
                name: "chainId_",
                type: "uint256",
              },
            ],
            payable: false,
            stateMutability: "nonpayable",
            type: "constructor",
          },
          {
            anonymous: false,
            inputs: [
              {
                indexed: true,
                internalType: "address",
                name: "src",
                type: "address",
              },
              {
                indexed: true,
                internalType: "address",
                name: "guy",
                type: "address",
              },
              {
                indexed: false,
                internalType: "uint256",
                name: "wad",
                type: "uint256",
              },
            ],
            name: "Approval",
            type: "event",
          },
          {
            anonymous: true,
            inputs: [
              {
                indexed: true,
                internalType: "bytes4",
                name: "sig",
                type: "bytes4",
              },
              {
                indexed: true,
                internalType: "address",
                name: "usr",
                type: "address",
              },
              {
                indexed: true,
                internalType: "bytes32",
                name: "arg1",
                type: "bytes32",
              },
              {
                indexed: true,
                internalType: "bytes32",
                name: "arg2",
                type: "bytes32",
              },
              {
                indexed: false,
                internalType: "bytes",
                name: "data",
                type: "bytes",
              },
            ],
            name: "LogNote",
            type: "event",
          },
          {
            anonymous: false,
            inputs: [
              {
                indexed: true,
                internalType: "address",
                name: "src",
                type: "address",
              },
              {
                indexed: true,
                internalType: "address",
                name: "dst",
                type: "address",
              },
              {
                indexed: false,
                internalType: "uint256",
                name: "wad",
                type: "uint256",
              },
            ],
            name: "Transfer",
            type: "event",
          },
          {
            constant: true,
            inputs: [],
            name: "DOMAIN_SEPARATOR",
            outputs: [
              {
                internalType: "bytes32",
                name: "",
                type: "bytes32",
              },
            ],
            payable: false,
            stateMutability: "view",
            type: "function",
          },
          {
            constant: true,
            inputs: [],
            name: "PERMIT_TYPEHASH",
            outputs: [
              {
                internalType: "bytes32",
                name: "",
                type: "bytes32",
              },
            ],
            payable: false,
            stateMutability: "view",
            type: "function",
          },
          {
            constant: true,
            inputs: [
              {
                internalType: "address",
                name: "",
                type: "address",
              },
              {
                internalType: "address",
                name: "",
                type: "address",
              },
            ],
            name: "allowance",
            outputs: [
              {
                internalType: "uint256",
                name: "",
                type: "uint256",
              },
            ],
            payable: false,
            stateMutability: "view",
            type: "function",
          },
          {
            constant: false,
            inputs: [
              {
                internalType: "address",
                name: "usr",
                type: "address",
              },
              {
                internalType: "uint256",
                name: "wad",
                type: "uint256",
              },
            ],
            name: "approve",
            outputs: [
              {
                internalType: "bool",
                name: "",
                type: "bool",
              },
            ],
            payable: false,
            stateMutability: "nonpayable",
            type: "function",
          },
          {
            constant: true,
            inputs: [
              {
                internalType: "address",
                name: "",
                type: "address",
              },
            ],
            name: "balanceOf",
            outputs: [
              {
                internalType: "uint256",
                name: "",
                type: "uint256",
              },
            ],
            payable: false,
            stateMutability: "view",
            type: "function",
          },
          {
            constant: false,
            inputs: [
              {
                internalType: "address",
                name: "usr",
                type: "address",
              },
              {
                internalType: "uint256",
                name: "wad",
                type: "uint256",
              },
            ],
            name: "burn",
            outputs: [],
            payable: false,
            stateMutability: "nonpayable",
            type: "function",
          },
          {
            constant: true,
            inputs: [],
            name: "decimals",
            outputs: [
              {
                internalType: "uint8",
                name: "",
                type: "uint8",
              },
            ],
            payable: false,
            stateMutability: "view",
            type: "function",
          },
          {
            constant: false,
            inputs: [
              {
                internalType: "address",
                name: "guy",
                type: "address",
              },
            ],
            name: "deny",
            outputs: [],
            payable: false,
            stateMutability: "nonpayable",
            type: "function",
          },
          {
            constant: false,
            inputs: [
              {
                internalType: "address",
                name: "usr",
                type: "address",
              },
              {
                internalType: "uint256",
                name: "wad",
                type: "uint256",
              },
            ],
            name: "mint",
            outputs: [],
            payable: false,
            stateMutability: "nonpayable",
            type: "function",
          },
          {
            constant: false,
            inputs: [
              {
                internalType: "address",
                name: "src",
                type: "address",
              },
              {
                internalType: "address",
                name: "dst",
                type: "address",
              },
              {
                internalType: "uint256",
                name: "wad",
                type: "uint256",
              },
            ],
            name: "move",
            outputs: [],
            payable: false,
            stateMutability: "nonpayable",
            type: "function",
          },
          {
            constant: true,
            inputs: [],
            name: "name",
            outputs: [
              {
                internalType: "string",
                name: "",
                type: "string",
              },
            ],
            payable: false,
            stateMutability: "view",
            type: "function",
          },
          {
            constant: true,
            inputs: [
              {
                internalType: "address",
                name: "",
                type: "address",
              },
            ],
            name: "nonces",
            outputs: [
              {
                internalType: "uint256",
                name: "",
                type: "uint256",
              },
            ],
            payable: false,
            stateMutability: "view",
            type: "function",
          },
          {
            constant: false,
            inputs: [
              {
                internalType: "address",
                name: "holder",
                type: "address",
              },
              {
                internalType: "address",
                name: "spender",
                type: "address",
              },
              {
                internalType: "uint256",
                name: "nonce",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "expiry",
                type: "uint256",
              },
              {
                internalType: "bool",
                name: "allowed",
                type: "bool",
              },
              {
                internalType: "uint8",
                name: "v",
                type: "uint8",
              },
              {
                internalType: "bytes32",
                name: "r",
                type: "bytes32",
              },
              {
                internalType: "bytes32",
                name: "s",
                type: "bytes32",
              },
            ],
            name: "permit",
            outputs: [],
            payable: false,
            stateMutability: "nonpayable",
            type: "function",
          },
          {
            constant: false,
            inputs: [
              {
                internalType: "address",
                name: "usr",
                type: "address",
              },
              {
                internalType: "uint256",
                name: "wad",
                type: "uint256",
              },
            ],
            name: "pull",
            outputs: [],
            payable: false,
            stateMutability: "nonpayable",
            type: "function",
          },
          {
            constant: false,
            inputs: [
              {
                internalType: "address",
                name: "usr",
                type: "address",
              },
              {
                internalType: "uint256",
                name: "wad",
                type: "uint256",
              },
            ],
            name: "push",
            outputs: [],
            payable: false,
            stateMutability: "nonpayable",
            type: "function",
          },
          {
            constant: false,
            inputs: [
              {
                internalType: "address",
                name: "guy",
                type: "address",
              },
            ],
            name: "rely",
            outputs: [],
            payable: false,
            stateMutability: "nonpayable",
            type: "function",
          },
          {
            constant: true,
            inputs: [],
            name: "symbol",
            outputs: [
              {
                internalType: "string",
                name: "",
                type: "string",
              },
            ],
            payable: false,
            stateMutability: "view",
            type: "function",
          },
          {
            constant: true,
            inputs: [],
            name: "totalSupply",
            outputs: [
              {
                internalType: "uint256",
                name: "",
                type: "uint256",
              },
            ],
            payable: false,
            stateMutability: "view",
            type: "function",
          },
          {
            constant: false,
            inputs: [
              {
                internalType: "address",
                name: "dst",
                type: "address",
              },
              {
                internalType: "uint256",
                name: "wad",
                type: "uint256",
              },
            ],
            name: "transfer",
            outputs: [
              {
                internalType: "bool",
                name: "",
                type: "bool",
              },
            ],
            payable: false,
            stateMutability: "nonpayable",
            type: "function",
          },
          {
            constant: false,
            inputs: [
              {
                internalType: "address",
                name: "src",
                type: "address",
              },
              {
                internalType: "address",
                name: "dst",
                type: "address",
              },
              {
                internalType: "uint256",
                name: "wad",
                type: "uint256",
              },
            ],
            name: "transferFrom",
            outputs: [
              {
                internalType: "bool",
                name: "",
                type: "bool",
              },
            ],
            payable: false,
            stateMutability: "nonpayable",
            type: "function",
          },
          {
            constant: true,
            inputs: [],
            name: "version",
            outputs: [
              {
                internalType: "string",
                name: "",
                type: "string",
              },
            ],
            payable: false,
            stateMutability: "view",
            type: "function",
          },
          {
            constant: true,
            inputs: [
              {
                internalType: "address",
                name: "",
                type: "address",
              },
            ],
            name: "wards",
            outputs: [
              {
                internalType: "uint256",
                name: "",
                type: "uint256",
              },
            ],
            payable: false,
            stateMutability: "view",
            type: "function",
          },
        ],
      },
    },
  },
  44010: {
    contracts: {
      Inbox: {
        address: "0xA4d796Ad4e79aFB703340a596AEd88f8a5924183",
        abi: [
          {
            inputs: [
              {
                internalType: "contract IBridge",
                name: "_bridge",
                type: "address"
              }
            ],
            stateMutability: "nonpayable",
            type: "constructor"
          },
          {
            anonymous: false,
            inputs: [
              {
                indexed: true,
                internalType: "uint256",
                name: "messageNum",
                type: "uint256"
              },
              {
                indexed: false,
                internalType: "bytes",
                name: "data",
                type: "bytes"
              }
            ],
            name: "InboxMessageDelivered",
            type: "event"
          },
          {
            anonymous: false,
            inputs: [
              {
                indexed: true,
                internalType: "uint256",
                name: "messageNum",
                type: "uint256"
              }
            ],
            name: "InboxMessageDeliveredFromOrigin",
            type: "event"
          },
          {
            inputs: [],
            name: "bridge",
            outputs: [
              {
                internalType: "contract IBridge",
                name: "",
                type: "address"
              }
            ],
            stateMutability: "view",
            type: "function"
          },
          {
            inputs: [
              {
                internalType: "address",
                name: "destAddr",
                type: "address"
              },
              {
                internalType: "uint256",
                name: "l2CallValue",
                type: "uint256"
              },
              {
                internalType: "uint256",
                name: "maxSubmissionCost",
                type: "uint256"
              },
              {
                internalType: "address",
                name: "excessFeeRefundAddress",
                type: "address"
              },
              {
                internalType: "address",
                name: "callValueRefundAddress",
                type: "address"
              },
              {
                internalType: "uint256",
                name: "maxGas",
                type: "uint256"
              },
              {
                internalType: "uint256",
                name: "gasPriceBid",
                type: "uint256"
              },
              {
                internalType: "bytes",
                name: "data",
                type: "bytes"
              }
            ],
            name: "createRetryableTicket",
            outputs: [
              {
                internalType: "uint256",
                name: "",
                type: "uint256"
              }
            ],
            stateMutability: "payable",
            type: "function"
          },
          {
            inputs: [
              {
                internalType: "address",
                name: "destAddr",
                type: "address"
              }
            ],
            name: "depositEth",
            outputs: [
              {
                internalType: "uint256",
                name: "",
                type: "uint256"
              }
            ],
            stateMutability: "payable",
            type: "function"
          },
          {
            inputs: [
              {
                internalType: "address",
                name: "destAddr",
                type: "address"
              },
              {
                internalType: "uint256",
                name: "maxSubmissionCost",
                type: "uint256"
              },
              {
                internalType: "uint256",
                name: "maxGas",
                type: "uint256"
              },
              {
                internalType: "uint256",
                name: "maxGasPrice",
                type: "uint256"
              }
            ],
            name: "depositEthRetryable",
            outputs: [
              {
                internalType: "uint256",
                name: "",
                type: "uint256"
              }
            ],
            stateMutability: "payable",
            type: "function"
          },
          {
            inputs: [
              {
                internalType: "uint256",
                name: "maxGas",
                type: "uint256"
              },
              {
                internalType: "uint256",
                name: "gasPriceBid",
                type: "uint256"
              },
              {
                internalType: "address",
                name: "destAddr",
                type: "address"
              },
              {
                internalType: "uint256",
                name: "amount",
                type: "uint256"
              },
              {
                internalType: "bytes",
                name: "data",
                type: "bytes"
              }
            ],
            name: "sendContractTransaction",
            outputs: [
              {
                internalType: "uint256",
                name: "",
                type: "uint256"
              }
            ],
            stateMutability: "nonpayable",
            type: "function"
          },
          {
            inputs: [
              {
                internalType: "uint256",
                name: "maxGas",
                type: "uint256"
              },
              {
                internalType: "uint256",
                name: "gasPriceBid",
                type: "uint256"
              },
              {
                internalType: "address",
                name: "destAddr",
                type: "address"
              },
              {
                internalType: "bytes",
                name: "data",
                type: "bytes"
              }
            ],
            name: "sendL1FundedContractTransaction",
            outputs: [
              {
                internalType: "uint256",
                name: "",
                type: "uint256"
              }
            ],
            stateMutability: "payable",
            type: "function"
          },
          {
            inputs: [
              {
                internalType: "uint256",
                name: "maxGas",
                type: "uint256"
              },
              {
                internalType: "uint256",
                name: "gasPriceBid",
                type: "uint256"
              },
              {
                internalType: "uint256",
                name: "nonce",
                type: "uint256"
              },
              {
                internalType: "address",
                name: "destAddr",
                type: "address"
              },
              {
                internalType: "bytes",
                name: "data",
                type: "bytes"
              }
            ],
            name: "sendL1FundedUnsignedTransaction",
            outputs: [
              {
                internalType: "uint256",
                name: "",
                type: "uint256"
              }
            ],
            stateMutability: "payable",
            type: "function"
          },
          {
            inputs: [
              {
                internalType: "bytes",
                name: "messageData",
                type: "bytes"
              }
            ],
            name: "sendL2Message",
            outputs: [
              {
                internalType: "uint256",
                name: "",
                type: "uint256"
              }
            ],
            stateMutability: "nonpayable",
            type: "function"
          },
          {
            inputs: [
              {
                internalType: "bytes",
                name: "messageData",
                type: "bytes"
              }
            ],
            name: "sendL2MessageFromOrigin",
            outputs: [
              {
                internalType: "uint256",
                name: "",
                type: "uint256"
              }
            ],
            stateMutability: "nonpayable",
            type: "function"
          },
          {
            inputs: [
              {
                internalType: "uint256",
                name: "maxGas",
                type: "uint256"
              },
              {
                internalType: "uint256",
                name: "gasPriceBid",
                type: "uint256"
              },
              {
                internalType: "uint256",
                name: "nonce",
                type: "uint256"
              },
              {
                internalType: "address",
                name: "destAddr",
                type: "address"
              },
              {
                internalType: "uint256",
                name: "amount",
                type: "uint256"
              },
              {
                internalType: "bytes",
                name: "data",
                type: "bytes"
              }
            ],
            name: "sendUnsignedTransaction",
            outputs: [
              {
                internalType: "uint256",
                name: "",
                type: "uint256"
              }
            ],
            stateMutability: "nonpayable",
            type: "function"
          }
        ],
      },
    },
  },
  44010: {
    contracts: {
      EthERC20Bridge: {
        address: "0x5F530aBc9e173107C07c6A0b4Dc1Ebb3d7F79a5f",
        abi: [
          {
            anonymous: false,
            inputs: [
              {
                indexed: true,
                internalType: 'uint256',
                name: 'seqNum',
                type: 'uint256',
              },
              {
                indexed: true,
                internalType: 'address',
                name: 'l1Address',
                type: 'address',
              },
              {
                indexed: false,
                internalType: 'address',
                name: 'l2Address',
                type: 'address',
              },
            ],
            name: 'ActivateCustomToken',
            type: 'event',
          },
          {
            anonymous: false,
            inputs: [
              {
                indexed: true,
                internalType: 'address',
                name: 'destination',
                type: 'address',
              },
              {
                indexed: false,
                internalType: 'address',
                name: 'sender',
                type: 'address',
              },
              {
                indexed: true,
                internalType: 'uint256',
                name: 'seqNum',
                type: 'uint256',
              },
              {
                indexed: true,
                internalType: 'enum StandardTokenType',
                name: 'tokenType',
                type: 'uint8',
              },
              {
                indexed: false,
                internalType: 'uint256',
                name: 'value',
                type: 'uint256',
              },
              {
                indexed: false,
                internalType: 'address',
                name: 'tokenAddress',
                type: 'address',
              },
            ],
            name: 'DepositToken',
            type: 'event',
          },
          {
            anonymous: false,
            inputs: [
              {
                indexed: true,
                internalType: 'uint256',
                name: 'seqNum',
                type: 'uint256',
              },
              {
                indexed: true,
                internalType: 'address',
                name: 'l1Address',
                type: 'address',
              },
              {
                indexed: false,
                internalType: 'bytes',
                name: 'name',
                type: 'bytes',
              },
              {
                indexed: false,
                internalType: 'bytes',
                name: 'symbol',
                type: 'bytes',
              },
              {
                indexed: false,
                internalType: 'bytes',
                name: 'decimals',
                type: 'bytes',
              },
            ],
            name: 'UpdateTokenInfo',
            type: 'event',
          },
          {
            inputs: [
              {
                internalType: 'address',
                name: 'erc20',
                type: 'address',
              },
            ],
            name: 'calculateL2ERC20Address',
            outputs: [
              {
                internalType: 'address',
                name: '',
                type: 'address',
              },
            ],
            stateMutability: 'view',
            type: 'function',
          },
          {
            inputs: [
              {
                internalType: 'address',
                name: 'erc20',
                type: 'address',
              },
            ],
            name: 'calculateL2ERC777Address',
            outputs: [
              {
                internalType: 'address',
                name: '',
                type: 'address',
              },
            ],
            stateMutability: 'view',
            type: 'function',
          },
          {
            inputs: [
              {
                internalType: 'address',
                name: '',
                type: 'address',
              },
            ],
            name: 'customL2Tokens',
            outputs: [
              {
                internalType: 'address',
                name: '',
                type: 'address',
              },
            ],
            stateMutability: 'view',
            type: 'function',
          },
          {
            inputs: [
              {
                internalType: 'address',
                name: 'erc20',
                type: 'address',
              },
              {
                internalType: 'address',
                name: 'destination',
                type: 'address',
              },
              {
                internalType: 'uint256',
                name: 'amount',
                type: 'uint256',
              },
              {
                internalType: 'uint256',
                name: 'maxSubmissionCost',
                type: 'uint256',
              },
              {
                internalType: 'uint256',
                name: 'maxGas',
                type: 'uint256',
              },
              {
                internalType: 'uint256',
                name: 'gasPriceBid',
                type: 'uint256',
              },
              {
                internalType: 'bytes',
                name: 'callHookData',
                type: 'bytes',
              },
            ],
            name: 'depositAsCustomToken',
            outputs: [
              {
                internalType: 'uint256',
                name: '',
                type: 'uint256',
              },
            ],
            stateMutability: 'payable',
            type: 'function',
          },
          {
            inputs: [
              {
                internalType: 'address',
                name: 'erc20',
                type: 'address',
              },
              {
                internalType: 'address',
                name: 'destination',
                type: 'address',
              },
              {
                internalType: 'uint256',
                name: 'amount',
                type: 'uint256',
              },
              {
                internalType: 'uint256',
                name: 'maxSubmissionCost',
                type: 'uint256',
              },
              {
                internalType: 'uint256',
                name: 'maxGas',
                type: 'uint256',
              },
              {
                internalType: 'uint256',
                name: 'gasPriceBid',
                type: 'uint256',
              },
              {
                internalType: 'bytes',
                name: 'callHookData',
                type: 'bytes',
              },
            ],
            name: 'depositAsERC20',
            outputs: [
              {
                internalType: 'uint256',
                name: '',
                type: 'uint256',
              },
            ],
            stateMutability: 'payable',
            type: 'function',
          },
          {
            inputs: [
              {
                internalType: 'address',
                name: 'erc20',
                type: 'address',
              },
              {
                internalType: 'address',
                name: 'destination',
                type: 'address',
              },
              {
                internalType: 'uint256',
                name: 'amount',
                type: 'uint256',
              },
              {
                internalType: 'uint256',
                name: 'maxSubmissionCost',
                type: 'uint256',
              },
              {
                internalType: 'uint256',
                name: 'maxGas',
                type: 'uint256',
              },
              {
                internalType: 'uint256',
                name: 'gasPriceBid',
                type: 'uint256',
              },
              {
                internalType: 'bytes',
                name: 'callHookData',
                type: 'bytes',
              },
            ],
            name: 'depositAsERC777',
            outputs: [
              {
                internalType: 'uint256',
                name: '',
                type: 'uint256',
              },
            ],
            stateMutability: 'payable',
            type: 'function',
          },
          {
            inputs: [
              {
                internalType: 'address',
                name: 'liquidityProvider',
                type: 'address',
              },
              {
                internalType: 'bytes',
                name: 'liquidityProof',
                type: 'bytes',
              },
              {
                internalType: 'address',
                name: 'erc20',
                type: 'address',
              },
              {
                internalType: 'uint256',
                name: 'amount',
                type: 'uint256',
              },
              {
                internalType: 'uint256',
                name: 'exitNum',
                type: 'uint256',
              },
            ],
            name: 'fastWithdrawalFromL2',
            outputs: [],
            stateMutability: 'nonpayable',
            type: 'function',
          },
          {
            inputs: [],
            name: 'inbox',
            outputs: [
              {
                internalType: 'contract IInbox',
                name: '',
                type: 'address',
              },
            ],
            stateMutability: 'view',
            type: 'function',
          },
          {
            inputs: [
              {
                internalType: 'address',
                name: '_inbox',
                type: 'address',
              },
              {
                internalType: 'address',
                name: '_l2Deployer',
                type: 'address',
              },
              {
                internalType: 'uint256',
                name: '_maxSubmissionCost',
                type: 'uint256',
              },
              {
                internalType: 'uint256',
                name: '_maxGas',
                type: 'uint256',
              },
              {
                internalType: 'uint256',
                name: '_gasPrice',
                type: 'uint256',
              },
              {
                internalType: 'address',
                name: '_l2TemplateERC777',
                type: 'address',
              },
              {
                internalType: 'address',
                name: '_l2TemplateERC20',
                type: 'address',
              },
              {
                internalType: 'address',
                name: '_l2Address',
                type: 'address',
              },
            ],
            name: 'initialize',
            outputs: [],
            stateMutability: 'payable',
            type: 'function',
          },
          {
            inputs: [],
            name: 'l2Address',
            outputs: [
              {
                internalType: 'address',
                name: '',
                type: 'address',
              },
            ],
            stateMutability: 'view',
            type: 'function',
          },
          {
            inputs: [
              {
                internalType: 'address',
                name: 'l1Address',
                type: 'address',
              },
              {
                internalType: 'uint256',
                name: 'maxSubmissionCost',
                type: 'uint256',
              },
              {
                internalType: 'uint256',
                name: 'maxGas',
                type: 'uint256',
              },
              {
                internalType: 'uint256',
                name: 'gasPriceBid',
                type: 'uint256',
              },
            ],
            name: 'notifyCustomToken',
            outputs: [
              {
                internalType: 'uint256',
                name: '',
                type: 'uint256',
              },
            ],
            stateMutability: 'payable',
            type: 'function',
          },
          {
            inputs: [
              {
                internalType: 'address',
                name: 'l2Address',
                type: 'address',
              },
            ],
            name: 'registerCustomL2Token',
            outputs: [],
            stateMutability: 'nonpayable',
            type: 'function',
          },
          {
            inputs: [
              {
                internalType: 'address',
                name: 'erc20',
                type: 'address',
              },
              {
                internalType: 'enum StandardTokenType',
                name: 'tokenType',
                type: 'uint8',
              },
              {
                internalType: 'uint256',
                name: 'maxSubmissionCost',
                type: 'uint256',
              },
              {
                internalType: 'uint256',
                name: 'maxGas',
                type: 'uint256',
              },
              {
                internalType: 'uint256',
                name: 'gasPriceBid',
                type: 'uint256',
              },
            ],
            name: 'updateTokenInfo',
            outputs: [
              {
                internalType: 'uint256',
                name: '',
                type: 'uint256',
              },
            ],
            stateMutability: 'payable',
            type: 'function',
          },
          {
            inputs: [
              {
                internalType: 'uint256',
                name: 'exitNum',
                type: 'uint256',
              },
              {
                internalType: 'address',
                name: 'erc20',
                type: 'address',
              },
              {
                internalType: 'address',
                name: 'destination',
                type: 'address',
              },
              {
                internalType: 'uint256',
                name: 'amount',
                type: 'uint256',
              },
            ],
            name: 'withdrawFromL2',
            outputs: [],
            stateMutability: 'nonpayable',
            type: 'function',
          },
        ],
      },
    },
  },
  153869338190755: {
    contracts: {
      ArbSys: {
        address: "0x0000000000000000000000000000000000000064",
        abi: [
          {
            anonymous: false,
            inputs: [
              {
                indexed: true,
                internalType: "address",
                name: "destAddr",
                type: "address"
              },
              {
                indexed: true,
                internalType: "address",
                name: "tokenAddr",
                type: "address"
              },
              {
                indexed: false,
                internalType: "uint256",
                name: "amount",
                type: "uint256"
              }
            ],
            name: "ERC20Withdrawal",
            type: "event"
          },
          {
            anonymous: false,
            inputs: [
              {
                indexed: true,
                internalType: "address",
                name: "destAddr",
                type: "address"
              },
              {
                indexed: true,
                internalType: "address",
                name: "tokenAddr",
                type: "address"
              },
              {
                indexed: true,
                internalType: "uint256",
                name: "id",
                type: "uint256"
              }
            ],
            name: "ERC721Withdrawal",
            type: "event"
          },
          {
            anonymous: false,
            inputs: [
              {
                indexed: true,
                internalType: "address",
                name: "destAddr",
                type: "address"
              },
              {
                indexed: false,
                internalType: "uint256",
                name: "amount",
                type: "uint256"
              }
            ],
            name: "EthWithdrawal",
            type: "event"
          },
          {
            inputs: [],
            name: "arbOSVersion",
            outputs: [
              {
                internalType: "uint256",
                name: "",
                type: "uint256"
              }
            ],
            stateMutability: "pure",
            type: "function"
          },
          {
            inputs: [
              {
                internalType: "address",
                name: "dest",
                type: "address"
              }
            ],
            name: "withdrawEth",
            outputs: [],
            stateMutability: "payable",
            type: "function"
          },
          {
            inputs: [
              {
                internalType: "address",
                name: "destAddr",
                type: "address"
              },
              {
                internalType: "bytes",
                name: "calldataForL1",
                type: "bytes"
              }
            ],
            name: "sendTxToL1",
            outputs: [],
            stateMutability: "payable",
            type: "function"
          },
          {
            inputs: [
              {
                internalType: "address",
                name: "account",
                type: "address"
              }
            ],
            name: "getTransactionCount",
            outputs: [
              {
                internalType: "uint256",
                name: "",
                type: "uint256"
              }
            ],
            stateMutability: "view",
            type: "function"
          },
          {
            inputs: [
              {
                internalType: "address",
                name: "account",
                type: "address"
              },
              {
                internalType: "uint256",
                name: "index",
                type: "uint256"
              }
            ],
            name: "getStorageAt",
            outputs: [
              {
                internalType: "uint256",
                name: "",
                type: "uint256"
              }
            ],
            stateMutability: "view",
            type: "function"
          }
        ],
      },
    },
  },
  153869338190755: {
    contracts: {
      StandardArbErc20: {
        address: "0x18EC25f3eCE5a0dE2484F39e3202d9300bDa8678",
        abi: [
          {
            anonymous: false,
            inputs: [
              {
                indexed: true,
                internalType: 'address',
                name: 'owner',
                type: 'address',
              },
              {
                indexed: true,
                internalType: 'address',
                name: 'spender',
                type: 'address',
              },
              {
                indexed: false,
                internalType: 'uint256',
                name: 'value',
                type: 'uint256',
              },
            ],
            name: 'Approval',
            type: 'event',
          },
          {
            anonymous: false,
            inputs: [
              {
                indexed: true,
                internalType: 'address',
                name: 'from',
                type: 'address',
              },
              {
                indexed: true,
                internalType: 'address',
                name: 'to',
                type: 'address',
              },
              {
                indexed: false,
                internalType: 'uint256',
                name: 'value',
                type: 'uint256',
              },
            ],
            name: 'Transfer',
            type: 'event',
          },
          {
            constant: false,
            inputs: [
              {
                internalType: 'address',
                name: 'account',
                type: 'address',
              },
              {
                internalType: 'uint256',
                name: 'amount',
                type: 'uint256',
              },
            ],
            name: 'adminMint',
            outputs: [],
            payable: false,
            stateMutability: 'nonpayable',
            type: 'function',
          },
          {
            constant: true,
            inputs: [
              {
                internalType: 'address',
                name: 'owner',
                type: 'address',
              },
              {
                internalType: 'address',
                name: 'spender',
                type: 'address',
              },
            ],
            name: 'allowance',
            outputs: [
              {
                internalType: 'uint256',
                name: '',
                type: 'uint256',
              },
            ],
            payable: false,
            stateMutability: 'view',
            type: 'function',
          },
          {
            constant: false,
            inputs: [
              {
                internalType: 'address',
                name: 'spender',
                type: 'address',
              },
              {
                internalType: 'uint256',
                name: 'amount',
                type: 'uint256',
              },
            ],
            name: 'approve',
            outputs: [
              {
                internalType: 'bool',
                name: '',
                type: 'bool',
              },
            ],
            payable: false,
            stateMutability: 'nonpayable',
            type: 'function',
          },
          {
            constant: true,
            inputs: [
              {
                internalType: 'address',
                name: 'account',
                type: 'address',
              },
            ],
            name: 'balanceOf',
            outputs: [
              {
                internalType: 'uint256',
                name: '',
                type: 'uint256',
              },
            ],
            payable: false,
            stateMutability: 'view',
            type: 'function',
          },
          {
            constant: false,
            inputs: [
              {
                internalType: 'address',
                name: 'spender',
                type: 'address',
              },
              {
                internalType: 'uint256',
                name: 'subtractedValue',
                type: 'uint256',
              },
            ],
            name: 'decreaseAllowance',
            outputs: [
              {
                internalType: 'bool',
                name: '',
                type: 'bool',
              },
            ],
            payable: false,
            stateMutability: 'nonpayable',
            type: 'function',
          },
          {
            constant: false,
            inputs: [
              {
                internalType: 'address',
                name: 'spender',
                type: 'address',
              },
              {
                internalType: 'uint256',
                name: 'addedValue',
                type: 'uint256',
              },
            ],
            name: 'increaseAllowance',
            outputs: [
              {
                internalType: 'bool',
                name: '',
                type: 'bool',
              },
            ],
            payable: false,
            stateMutability: 'nonpayable',
            type: 'function',
          },
          {
            constant: true,
            inputs: [],
            name: 'totalSupply',
            outputs: [
              {
                internalType: 'uint256',
                name: '',
                type: 'uint256',
              },
            ],
            payable: false,
            stateMutability: 'view',
            type: 'function',
          },
          {
            constant: false,
            inputs: [
              {
                internalType: 'address',
                name: 'recipient',
                type: 'address',
              },
              {
                internalType: 'uint256',
                name: 'amount',
                type: 'uint256',
              },
            ],
            name: 'transfer',
            outputs: [
              {
                internalType: 'bool',
                name: '',
                type: 'bool',
              },
            ],
            payable: false,
            stateMutability: 'nonpayable',
            type: 'function',
          },
          {
            constant: false,
            inputs: [
              {
                internalType: 'address',
                name: 'sender',
                type: 'address',
              },
              {
                internalType: 'address',
                name: 'recipient',
                type: 'address',
              },
              {
                internalType: 'uint256',
                name: 'amount',
                type: 'uint256',
              },
            ],
            name: 'transferFrom',
            outputs: [
              {
                internalType: 'bool',
                name: '',
                type: 'bool',
              },
            ],
            payable: false,
            stateMutability: 'nonpayable',
            type: 'function',
          },
          {
            constant: false,
            inputs: [
              {
                internalType: 'address',
                name: 'account',
                type: 'address',
              },
              {
                internalType: 'uint256',
                name: 'amount',
                type: 'uint256',
              },
            ],
            name: 'withdraw',
            outputs: [],
            payable: false,
            stateMutability: 'nonpayable',
            type: 'function',
          },
        ],
      },
    },
  }
};
