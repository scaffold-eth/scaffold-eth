import { JsonRpcProvider, Provider, Web3Provider } from '@ethersproject/providers';

export type TEthHooksProvider = JsonRpcProvider | Web3Provider | Provider;
