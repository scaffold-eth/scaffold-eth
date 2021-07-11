import React, { FC } from 'react';
import { GenericContract } from '~~/components/generic-contract';
import { Contract } from 'ethers';
import { TEthHooksProvider, TProviderAndSigner } from 'eth-hooks/lib/models';

interface IMainPageContracts {
  mainnetProvider: TEthHooksProvider;
  mainnetContracts: Record<string, Contract>;
  userProviderAndSigner: TProviderAndSigner;
  localProvider: TEthHooksProvider;
  userAddress: string;
  blockExplorerUrl: string;
}

/**
 * 🎛 this scaffolding is full of commonly used components
    this <GenericContract/> component will automatically parse your ABI
    and give you a form to interact with it locally
 * @param props 
 * @returns 
 */
export const MainPageContracts: FC<IMainPageContracts> = (props) => {
  return (
    <>
      {/*
        🎛 this scaffolding is full of commonly used components
        this <Contract/> component will automatically parse your ABI
        and give you a form to interact with it locally
      */}
      {props.userProviderAndSigner?.signer != null && (
        <>
          <GenericContract
            contractName="YourContract"
            signer={props.userProviderAndSigner.signer}
            provider={props.localProvider}
            address={props.userAddress}
            blockExplorer={props.blockExplorerUrl}
          />

          {/* uncomment for a second contract: 
        <GenericContract
          name="SecondContract"
          signer={props.userProviderAndSigner.signer}
          provider={props.localProvider}
          address={props.userAddress}
          blockExplorer={props.blockExplorerUrl}
        />
        */}

          {/* Uncomment to display and interact with an external contract (DAI on mainnet): 
        <GenericContract
          name="DAI"
          customContract={props.mainnetContracts?.['DAI']}
          signer={props.userProviderAndSigner.signer}
          provider={props.mainnetProvider}
          address={props.userAddress}
          blockExplorer={props.blockExplorerUrl}
        />
        */}
        </>
      )}
    </>
  );
};
