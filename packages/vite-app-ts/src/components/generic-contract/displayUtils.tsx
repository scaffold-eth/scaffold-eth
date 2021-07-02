import { formatUnits } from '@ethersproject/units';
import { BigNumber } from 'ethers';
import React from 'react';
import { Address } from '../common/Address';

export const tryToDisplay = (thing: any) => {
  if (thing && thing.toNumber) {
    try {
      return thing.toNumber();
    } catch (e) {
      return 'Ξ' + formatUnits(thing, 'ether');
    }
  }
  if (thing && thing.indexOf && thing.indexOf('0x') === 0 && thing.length === 42) {
    return <Address address={thing} fontSize={22} />;
  }
  return JSON.stringify(thing);
};
