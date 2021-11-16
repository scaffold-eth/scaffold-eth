import React, { useContext } from "react";
import { Contract } from "../components";
import { Web3Context } from "../helpers/Web3Context";

export default function debugcontracts({ props }) {
  const web3 = useContext(Web3Context);

  return (
    <>
      <div className="text-center" style={{ margin: 64 }}>
        <span>This App is powered by Scaffold-eth & Next.js!</span>
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
          name="NextJSTicket"
          signer={web3.userSigner}
          provider={web3.localProvider}
          address={web3.address}
          blockExplorer={web3.blockExplorer}
          contractConfig={web3.contractConfig}
        />
      </div>
    </>
  );
}
