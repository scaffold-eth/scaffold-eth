// import { initializeAlchemy, getNftsForCollection, Network } from '@alch/alchemy-sdk'

export async function getAllRewards(contractAddress, provider) {
  let result = await fetch(provider, {
    method: 'POST', // *GET, POST, PUT, DELETE, etc.
    mode: 'cors', // no-cors, *cors, same-origin
    cache: 'no-cache', // *default, no-cache, reload, force-cache, only-)
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      jsonrpc: '2.0',
      method: 'eth_getLogs',
      params: [
        {
          address: '' + contractAddress + '',
          topics: ['0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef'],
          fromBlock: '0x58B5AB',
        },
      ],
      id: 0,
    }),
  })
  result = await result.json()
  // @ts-ignore
  return result.result.reverse()
}

/*
curl https://eth-mainnet.alchemyapi.io/v2/cdGnPX6sQLXv-YWkbzYAXnTVVfuL8fhb \
-X POST \
-H "Content-Type: application/json" \
-d '{"jsonrpc":"2.0","method":"eth_getLogs","params":[{"address": "0x5d470270e889b61c08C51784cDC73442c4554011", "fromBlock": "5813675"}],"id":0}'


curl https://opt-mainnet.g.alchemy.com/v2/cdGnPX6sQLXv-YWkbzYAXnTVVfuL8fhb \
-X POST \
-H "Content-Type: application/json" \
-d '{"jsonrpc":"2.0","method":"eth_getLogs","params":[{"address": "0x5d470270e889b61c08C51784cDC73442c4554011", "fromBlock": "0x58B5AB"}],"id":0}'
*/
