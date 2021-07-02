import React, { FC } from 'react';
import Blockies from 'react-blockies';

// provides a blockie image for the address using "react-blockies" library

interface IBlockieProps {
  address: string;
  scale: number;
}

export const Blockie: FC<IBlockieProps> = (props) => {
  if (!props.address || typeof props.address.toLowerCase !== 'function') {
    return <span />;
  }
  // eslint-disable-next-line react/jsx-props-no-spreading
  return <Blockies seed={props.address.toLowerCase()} {...props} />;
};
