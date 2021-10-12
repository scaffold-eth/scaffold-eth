import React, { useContext } from "react";
import { Contract } from "../components";
import { Web3Context } from "../helpers/Web3Context";

function Debug() {
  const context = useContext(Web3Context);

  console.log(`🗄 context context:`, context);

  return (
    <div className="flex flex-1 flex-col h-screen w-full items-center">
      <div className="text-center">
        <Contract
          name="YourContract"
          signer={context.userSigner}
          provider={context.localProvider}
          address={context.address}
          blockExplorer={context.blockExplorer}
          contractConfig={context.contractConfig}
        />
      </div>
    </div>
  );
}

export default Debug;
