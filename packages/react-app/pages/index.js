import React from "react";
import { Web3Consumer } from "../helpers/Web3Context";
import { Contract } from "../components";


function Home({ web3 }) {

  console.log(`🗄 web3 context:`, web3);

  return (
    <div className="flex flex-1 flex-col h-screen w-full items-center justify-center">
      <div className="text-center" style={{marginBottom:32}}>
        <span>This App is powered by Scaffold-eth & Next.js!</span>
        <br />
        <span>
          Added{" "}
          <a href="https://tailwindcomponents.com/cheatsheet/" target="_blank">
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
           {...web3}
         />
      </div>
    </div>
  );
}

export default Web3Consumer(Home);
