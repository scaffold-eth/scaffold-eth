import { ethers, Signer, utils } from 'ethers';
import 'hardhat-deploy-ethers';
import { HardhatEthersHelpers } from 'hardhat-deploy-ethers/src/types';

import { HardhatRuntimeEnvironment } from 'hardhat/types';
import 'hardhat-deploy/src/type-extensions';

// export type ContractJson = {
//   _format: string;
//   contractName: string;
//   abi: Record<string, object>[];
//   bytecode: string;
//   deployedBytecode: string;
//   linkReferences: Record<string, object>;
//   deployedLinkReferences: Record<string, object>;
//   address: string;
// };

export type { HardhatRuntimeEnvironment as HardhatRuntimeEnvironmentT };

export type { Deployment as DeploymentT } from 'hardhat-deploy/types';

export type EthersT = typeof ethers & HardhatRuntimeEnvironment['ethers'];

// export const castEthersT = (e: (typeof ethers & HardhatEthersHelpers) | any): EthersT => {
//   return e as EthersT;
// };
