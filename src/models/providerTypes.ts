import { JsonRpcProvider, StaticJsonRpcProvider, Web3Provider } from '@ethersproject/providers';
import { ethers, Signer } from 'ethers';

export type TEthHooksProvider = JsonRpcProvider | Web3Provider | StaticJsonRpcProvider;

export type TProviderOrSigner = JsonRpcProvider | Web3Provider | StaticJsonRpcProvider | Signer;

export type TProviderAndSigner = {
  signer: Signer | undefined;
  provider: ethers.providers.Provider | undefined;
  providerNetwork: ethers.providers.Network | undefined;
};
