import { message } from "antd";

export async function addXDAItoMetamask(props) {
  if (props.injectedProvider.connection && props.injectedProvider.connection.url === "metamask") {
    try {
      let result = await window.ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [{
        chainId: '0x64',
        chainName: 'xDAI Chain',
        rpcUrls: ["https://rpc.xdaichain.com"],
        iconUrls:["https://gblobscdn.gitbook.com/spaces%2F-Lpi9AHj62wscNlQjI-l%2Favatar.png"],
        nativeCurrency: {
          "name": "xDAI",
          "symbol": "xDAI",
          "decimals": 18
        },
        blockExplorerUrls: ["https://blockscout.com/xdai/mainnet"]
      }],
    });
    console.log(result)
    return result
    } catch (error) {
      throw error
    }
  } else {
    message.error("MetaMask was not detected. Make sure MetaMask is installed and connected!")
  }
}
