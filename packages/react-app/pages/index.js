import { Button } from "antd";
import React, { useContext } from "react";
import { Contract, Account, Header, AddressInput, StakingPool } from "../components";
import { Web3Consumer } from "../helpers/Web3Context";

function Home({ web3 }) {
  console.log(`🗄 web3 context:`, web3);

  return (
    <>
      {/* Page Header start */}
      <div className="flex flex-1 justify-between items-center">
        <Header />
        <div className="mr-6">
          <Account {...web3} />
        </div>
      </div>
      {/* Page Header end */}

      <div className="container mx-auto">
        <div className="flex flex-1 justify-end items-center mt-16">
          <Button>Add Project</Button>
        </div>

        <div className="mt-16">
          <StakingPool
            id={1}
            address={web3.address}
            tx={web3.tx}
            writeContracts={web3.writeContracts}
            readContracts={web3.readContracts}
          />
        </div>
      </div>
    </>
  );
}

export default Web3Consumer(Home);
