import { JsonRpcProvider, Provider, Web3Provider } from '@ethersproject/providers';
import { Signer } from 'ethers';

export type TEthHooksProvider = JsonRpcProvider | Web3Provider | Provider;

export type TProviderOrSigner = TEthHooksProvider | Signer;
