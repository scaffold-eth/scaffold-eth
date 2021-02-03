import React from "react";
// import { formatEther } from "@ethersproject/units";
// import { Address, AddressInput, TokenList} from "../components";
// import { fetchTokenList } from '../helpers/TokenList';

export default function Hints() {

  return (
    <div>
      <br />      <br />
      <div style={{ margin: 32 }}>
        <span style={{ marginRight: 8 }} role='img' aria-label='hardhat'>👷</span>
        Open 4 terminals in root folder<br />
        yarn run chain --- GANACHE local network<br />
        yarn run deploy / Copy 'packages/react-app/CopyToNoun.abi.js' content into '../react-app/src/contracts/Noun.abi.js' (if there have been changes in contract, must recopy ABI from Verb) - Copy also 'the-graph-NounABI' content into 'subgraph/abis/Nouns.json' --- Artifacts and ABIs generation<br />
        rm -rf docker/graph-node/data/ - yarn graph-run-node (mac/windows users: change host.internal.docker in root/docker/docker-compose.yml (refer to original line in scaffold-eth)) --- Docker node <br />
         - (if first time (or rm'ed data): yarn graph-create-local) - yarn graph-ship-local (every update of the-graph code) --- Create/Launch Docker graph <br />
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
        <h3>PROBLEMS</h3><br />
        Any reload on /Create will have a problem reading Stoodges coins addresses (this wont happen in the wild) go to any other and come back<br />
        <h3>TODO</h3><br/>
        Stoodges tokens not working (compiled ERC20 with pragma 8 required to modify transfer and approval functions(error is in those fn))<br />
        ERC721?? create function for token handling and receiver<br />
        Change /Create, assign wills data in props for updates, if null, then create<br/>
        Finish thegraph events mappings (setDeadline and setBeneficiaries should emit index)<br />
        -------------------------------------<br/>
        Then.. <br/>
        Multi pragma compiler for contracts with hardhat
         <br />

      </div>


    </div>
  );
}