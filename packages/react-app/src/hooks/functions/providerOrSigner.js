import { JsonRpcProvider, Web3Provider } from "@ethersproject/providers";
import { Signer } from "ethers";
/**
 * Parse TEthersProviderOrSigner to TProviderAndSigner
 * @param providerOrSigner TEthersProviderOrSigner
 * @returns TProviderAndSigner
 */
export const parseProviderOrSigner = async providerOrSigner => {
  let signer = undefined;
  let provider;
  let providerNetwork;
  if (providerOrSigner && (providerOrSigner instanceof JsonRpcProvider || providerOrSigner instanceof Web3Provider)) {
    const accounts = await providerOrSigner.listAccounts();
    if (accounts && accounts.length > 0) {
      signer = providerOrSigner.getSigner();
    }
    provider = providerOrSigner;
    providerNetwork = await providerOrSigner.getNetwork();
  }
  if (!signer && providerOrSigner instanceof Signer) {
    signer = providerOrSigner;
    provider = signer.provider;
    providerNetwork = provider && (await provider.getNetwork());
  }
  return { signer, provider, providerNetwork };
};
