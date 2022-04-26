export const switchNetworks = async targetNetwork => {
  const ethereum = window.ethereum;
  const data = [
    {
      chainId: "0x" + targetNetwork.chainId.toString(16),
      chainName: targetNetwork.name,
      nativeCurrency: targetNetwork.nativeCurrency,
      rpcUrls: [targetNetwork.rpcUrl],
      blockExplorerUrls: [targetNetwork.blockExplorer],
    },
  ];
  console.log("data", data);

  let switchTx;
  // https://docs.metamask.io/guide/rpc-api.html#other-rpc-methods
  try {
    switchTx = await ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: data[0].chainId }],
    });
  } catch (switchError) {
    // not checking specific error code, because maybe we're not using MetaMask
    try {
      switchTx = await ethereum.request({
        method: "wallet_addEthereumChain",
        params: data,
      });
    } catch (addError) {
      // handle "add" error
    }
  }

  if (switchTx) {
    console.log(switchTx);
  }
};
