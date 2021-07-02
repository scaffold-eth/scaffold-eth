import { JsonRpcProvider } from '@ethersproject/providers';
import { Web3Provider } from '@ethersproject/providers/src.ts/web3-provider';
import { ethers } from 'ethers';
import { Signer } from 'ethers/lib/ethers';

interface IParseProviderOrSigner {
  signer: Signer | undefined;
  provider: ethers.providers.Provider | undefined;
  providerNetwork: ethers.providers.Network | undefined;
}

export type TProviderOrSigner = JsonRpcProvider | undefined | Signer | Web3Provider;

export const parseProviderOrSigner = async (providerOrSigner: TProviderOrSigner): Promise<IParseProviderOrSigner> => {
  let signer: Signer | undefined = undefined;
  let accounts: string[];
  let provider: ethers.providers.Provider | undefined;
  let providerNetwork: ethers.providers.Network | undefined;

  if (providerOrSigner && (providerOrSigner instanceof JsonRpcProvider || providerOrSigner instanceof Web3Provider)) {
    accounts = await providerOrSigner.listAccounts();
    if (accounts && accounts.length > 0) {
      signer = providerOrSigner.getSigner();
    }
    provider = providerOrSigner;
    providerNetwork = await providerOrSigner.getNetwork();
  }

  if (!signer && providerOrSigner instanceof Signer) {
    signer = providerOrSigner as Signer;
    provider = signer.provider;
    providerNetwork = provider && (await provider.getNetwork());
  }
  return { signer, provider, providerNetwork };
};
