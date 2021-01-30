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
        Open 3 terminals in root folder<br />
        yarn run chain<br />
        yarn run deploy<br />
        yarn start<br />
        Copy packages/react-app/src/contracts/CopyToNoun.abi.js content into 'Noun.abi.js'<br />
        You should now have in YourContract frontpage 4 contracts with its functions <br />
        You can mint the Stoodges tokens from there and send it to your accounts<br />
        Open an incongnito window to interact with different burner wallets<br />
        Feed yourself freely from the faucet<br />
        Ok! start creating wills with the functions, you can fund them with raw ETH and StoodgesTokens<br/>
        If you interact from components in YourContract, remember to convert amount to Hex<br/>
        In Create there are elements for wills creation (currently with a problem), also reference of timestamp (for a new will you need a timestamp > now)<br/>
        In Manage you can see a simple event catcher (only for creation) with simple interaction<br />
        --------------------------------------------------------------------------------------<br/>
        TODO<br/>

      </div>


    </div>
  );
}
