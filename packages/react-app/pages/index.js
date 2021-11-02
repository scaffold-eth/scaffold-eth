import React, { useContext } from "react";
import { Contract } from "../components";
import { Web3Context } from "../helpers/Web3Context";

function Home() {
  const web3 = useContext(Web3Context);

  console.log(`🗄 web3 context:`, web3);

  return (
    <div className="flex flex-1 flex-col h-screen w-full items-center">
      <div className="text-center" style={{ margin: 64 }}>
        <span>This App is powered by Scaffold-eth & Next.js!</span>
        <br />
        <span>Ceramic Starter Kit</span>
        <br />
        <span>
          Added{" "}
          <a href="https://tailwindcomponents.com/cheatsheet/" target="_blank" rel="noreferrer">
            TailwindCSS
          </a>{" "}
          for easier styling.
        </span>
      </div>
      <div className="text-center">
        <Contract
          name="YourContract"
          signer={web3.userSigner}
          provider={web3.localProvider}
          address={web3.address}
          blockExplorer={web3.blockExplorer}
          contractConfig={web3.contractConfig}
        />
      </div>
    </div>
  );
}

export default Home;
