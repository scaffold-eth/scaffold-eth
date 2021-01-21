/* eslint-disable jsx-a11y/accessible-emoji */

import React from "react";
import { formatEther } from "@ethersproject/units";
import { Address, AddressInput } from "../components";


export default function Hints({yourLocalBalance, mainnetProvider, price, address }) {

  return (
    <div>
      <div style={{ margin: 32 }}>
        <span style={{ marginRight: 8 }}>👷</span>
        What about a <b>TODO</b> list?
      </div>


    </div>
  );
}
