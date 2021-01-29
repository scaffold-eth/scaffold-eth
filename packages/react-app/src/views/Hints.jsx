/* eslint-disable jsx-a11y/accessible-emoji */

import React from "react";
import { formatEther } from "@ethersproject/units";
import { Address, AddressInput, TokenList} from "../components";
// import { fetchTokenList } from '../helpers/TokenList';

export default function Hints({mainnetProvider, price, address, localProvider }) {




  return (
    <div>
      <div style={{ margin: 32 }}>
        <span style={{ marginRight: 8 }}>👷</span>
        
      </div>


    </div>
  );
}
