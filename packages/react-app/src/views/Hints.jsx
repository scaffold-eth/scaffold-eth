/* eslint-disable jsx-a11y/accessible-emoji */

import React from "react";
import { formatEther } from "@ethersproject/units";
import { Address, AddressInput } from "../components";


export default function Hints({yourLocalBalance, mainnetProvider, price, address }) {

  return (
    <div>
      <div style={{ margin: 32 }}>
        <span style={{ marginRight: 8 }}>👷</span>
        Open 4 terminals in root folder<br />
        yarn run chain --- GANACHE local network<br />
        yarn run deploy / Copy 'packages/react-app/CopyToNoun.abi.js' content into '../react-app/src/contracts/Noun.abi.js' (if there have been changes in contract, must recopy ABI from Verb) - Copy also 'the-graph-NounABI' content into 'subgraph/abis/Nouns.json' --- Artifacts and ABIs generation<br />
        rm -rf docker/graph-node/data/ - yarn graph-run-node (linux users: sudo it and had changed host.internal.docker in root/docker/docker-compose.yml) --- Docker node <br />
         - (if first time (or rm'ed data): yarn graph-create-local) - yarn graph-ship-local --- Create/Launch Docker graph <br />
        yarn start --- Server<br />
        <br />
        You should now have in /YourContract (frontpage) 4 contracts with its functions <br />
        You can mint the Stoodges tokens from there and send it to your burner account<br />
        Open an incongnito window to interact with different burner wallets<br />
        Feed yourself freely from the faucet<br />
        Ok! start creating wills with the functions, you can fund them with raw ETH<br/>
        If you interact from components in /YourContract, remember to convert amounts to Hex (there are magic buttons!)<br/>
        In Create there are elements for wills creation, also reference of timestamp (for a new will you need a timestamp > now)<br/>
        In Manage you can see a simple query'er with simple interaction, filters to come!<br />
        Index in /Manage start from 1, if you need to interact with the will remember to index-1<br />
        --------------------------------------------------------------------------------------<br/>
        PROBLEMS<br />
        Any reload on /Create will have a problem reading Stoodges coins addresses (this wont happen in the wild) go to any other and come back<br />
        TODO<br/>
        Stoodges tokens not working (compiled ERC20 with pragma 8 required to modify transfer and approval functions(error is in those fn))<br />
        ERC721??<br />
        Change /Create, assign wills data in props for updates, if null, then create<br/>
        Finish thegraph events mappings<br />
        -------------------------------------<br/>
        Then.. <br/>
        Multi pragma compiler for contracts with hardhat
         <br />


      <div style={{ marginTop: 32 }}>
        <span style={{ marginRight: 8 }}>⚙️</span>
        build your app with
        <span style={{ marginLeft: 4, backgroundColor: "#f1f1f1", padding: 4, borderRadius: 4, fontWeight: "bolder" }}>
          yarn run build
        </span>
      </div>

      <div style={{ marginTop: 32 }}>
        <span style={{ marginRight: 8 }}>🚢</span>
        ship it!
        <span style={{ marginLeft: 4, backgroundColor: "#f1f1f1", padding: 4, borderRadius: 4, fontWeight: "bolder" }}>
          yarn run surge
        </span>
        or
        <span style={{ marginLeft: 4, backgroundColor: "#f1f1f1", padding: 4, borderRadius: 4, fontWeight: "bolder" }}>
          yarn run s3
        </span>
        or
        <span style={{ marginLeft: 4, backgroundColor: "#f1f1f1", padding: 4, borderRadius: 4, fontWeight: "bolder" }}>
          yarn run ipfs
        </span>
      </div>

      <div style={{ marginTop: 32 }}>
        <span style={{ marginRight: 8 }}>💬</span>
        for support, join this
        <span style={{ marginLeft: 4, backgroundColor: "#f9f9f9", padding: 4, borderRadius: 4, fontWeight: "bolder" }}>
          <a target="_blank" rel="noopener noreferrer" href="https://t.me/joinchat/KByvmRe5wkR-8F_zz6AjpA">
            Telegram Chat
          </a>
        </span>
      </div>
      <div style={{ padding: 128 }}>
        🛠 Check out your browser's developer console for more... (inpect -> console) 🚀
      </div>
    </div>
  );
}
