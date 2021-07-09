import { JsonRpcProvider, Web3Provider } from '@ethersproject/providers';
import { ethers, Signer } from 'ethers';

import { TProviderAndSigner, TProviderOrSigner } from '~~/models';

export const parseProviderOrSigner = async (
  providerOrSigner: TProviderOrSigner | undefined
): Promise<TProviderAndSigner> => {
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
    signer = providerOrSigner;
    provider = signer.provider;
    providerNetwork = provider && (await provider.getNetwork());
  }
  return { signer, provider, providerNetwork } as TProviderAndSigner;
};
