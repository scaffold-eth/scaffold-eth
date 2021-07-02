import { JsonRpcProvider, JsonRpcSigner, Web3Provider } from '@ethersproject/providers';
import { Card } from 'antd';
import { Contract } from 'ethers';
import { FunctionFragment } from 'ethers/lib/utils';
import React, { FC, ReactElement, useMemo, useState } from 'react';
import { useContractExistsAtAddress, useContractLoader } from '~~/components/common/hooks';
import { Account } from '../common';
import { DisplayVariable } from './DisplayVariable';
import { FunctionForm } from './FunctionFrom';

const noContractDisplay = (
  <div>
    Loading...{' '}
    <div style={{ padding: 32 }}>
      You need to run{' '}
      <span
        className="highlight"
        style={{ marginLeft: 4, /* backgroundColor: "#f1f1f1", */ padding: 4, borderRadius: 4, fontWeight: 'bolder' }}>
        yarn run chain
      </span>{' '}
      and{' '}
      <span
        className="highlight"
        style={{ marginLeft: 4, /* backgroundColor: "#f1f1f1", */ padding: 4, borderRadius: 4, fontWeight: 'bolder' }}>
        yarn run deploy
      </span>{' '}
      to see your contract here.
    </div>
    <div style={{ padding: 32 }}>
      <span style={{ marginRight: 4 }} role="img" aria-label="warning">
        ☢️
      </span>
      Warning: You might need to run
      <span
        className="highlight"
        style={{ marginLeft: 4, /* backgroundColor: "#f1f1f1", */ padding: 4, borderRadius: 4, fontWeight: 'bolder' }}>
        yarn run deploy
      </span>{' '}
      <i>again</i> after the frontend comes up!
    </div>
  </div>
);

const isQueryable = (fn: FunctionFragment) =>
  (fn.stateMutability === 'view' || fn.stateMutability === 'pure') && fn.inputs.length === 0;

interface IGenericContract {
  customContract?: Contract;
  account?: ReactElement;
  gasPrice?: number;
  signer?: JsonRpcSigner;
  provider: JsonRpcProvider | Web3Provider | undefined;
  name: string;
  show?: string;
  price?: number;
  blockExplorer: string;
  address: string;
}

export const GenericContract: FC<IGenericContract> = (props) => {
  const contracts = useContractLoader(props.provider);
  let contract: Contract | undefined = props.customContract;
  if (!props.customContract) {
    contract = contracts ? contracts[props.name] : undefined;
  }
  const address = contract ? contract.address : '';
  const contractIsDeployed = useContractExistsAtAddress(props.provider, address);

  const displayedContractFunctions = useMemo(
    () =>
      contract
        ? Object.values(contract.interface.functions).filter(
            (fn) => fn.type === 'function' && !(props.show && props.show.indexOf(fn.name) < 0)
          )
        : [],
    [contract, props.show]
  );

  const [refreshRequired, setTriggerRefresh] = useState(false);
  const contractDisplay = displayedContractFunctions.map((fn) => {
    if (isQueryable(fn)) {
      // If there are no inputs, just display return value
      return (
        <DisplayVariable
          key={fn.name}
          contractFunction={contract?.[fn.name]}
          functionInfo={fn}
          refreshRequired={refreshRequired}
          setTriggerRefresh={setTriggerRefresh}
        />
      );
    }
    // If there are inputs, display a form to allow users to provide these
    return (
      <FunctionForm
        key={'FF' + fn.name}
        contractFunction={
          fn.stateMutability === 'view' || fn.stateMutability === 'pure'
            ? contract?.[fn.name]
            : contract?.connect(props.signer)[fn.name]
        }
        functionInfo={fn}
        provider={props.provider}
        gasPrice={props.gasPrice}
        setTriggerRefresh={setTriggerRefresh}
      />
    );
  });

  return (
    <div style={{ margin: 'auto', width: '70vw' }}>
      <Card
        title={
          <div>
            {name}
            <div style={{ float: 'right' }}>
              <Account
                address={address}
                localProvider={props.provider}
                injectedProvider={props.provider}
                mainnetProvider={props.provider}
                price={props.price}
                blockExplorer={props.blockExplorer}
              />
              {props.account}
            </div>
          </div>
        }
        size="default"
        style={{ marginTop: 25, width: '100%' }}
        loading={contractDisplay && contractDisplay.length <= 0}>
        {contractIsDeployed ? contractDisplay : noContractDisplay}
      </Card>
    </div>
  );
};
