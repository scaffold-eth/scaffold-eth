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
        Copy packages/react-app/CopyToNoun.abi.js content into '../react-app/src/contracts/Noun.abi.js'<br />
        You should now have in YourContract frontpage 4 contracts with its functions <br />
        You can mint the Stoodges tokens from there and send it to your accounts<br />
        Open an incongnito window to interact with different burner wallets<br />
        Feed yourself freely from the faucet<br />
        Ok! start creating wills with the functions, you can fund them with raw ETH<br/>
        If you interact from components in /YourContract, remember to convert amounts to Hex<br/>
        In Create there are elements for wills creation, also reference of timestamp (for a new will you need a timestamp > now)<br/>
        In Manage you can see a simple event catcher (only for creation) with simple interaction<br />
        Index in /Manage start from 1, if you need to interact with the will just index-1<br />
        --------------------------------------------------------------------------------------<br/>
        TODO<br/>
        Any reload on /Create will have a problem reading Stoodges coins addresses (this wont happen in the wild) go to any other and come back<br />
        Stoodges tokens not working (compiled ERC20 with pragma 8 required to modify transfer and approval functions(error is in those fn))<br />
        Weirdly claim and withdraw not working from /Manage, yes from root(check out signature for onlyOwner & onlyBeneficiary) <br />

      </div>


    </div>
  );
}
