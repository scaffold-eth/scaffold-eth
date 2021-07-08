import { JsonRpcProvider, StaticJsonRpcProvider, Web3Provider } from '@ethersproject/providers';
import { Signer } from 'ethers';

export type TEthHooksProvider = JsonRpcProvider | Web3Provider | StaticJsonRpcProvider;

export type TProviderOrSigner = JsonRpcProvider | Web3Provider | StaticJsonRpcProvider | Signer;
