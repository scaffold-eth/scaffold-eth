import { ExternalProvider } from '@ethersproject/providers/src.ts/web3-provider';
import nodeBuffer from 'buffer';
import nodeProcess from 'process';

export {};

(window as any).global = window;
var global = window;

if (!global.hasOwnProperty('Buffer')) {
  (global as any).Buffer = nodeBuffer.Buffer;
}

(global as any).process = nodeProcess;

interface Window {
  ethereum: ExternalProvider;
  location: any;
  localStorage: { getItem: (key: string) => any; setItem: (key: string, value: string) => any };
}
