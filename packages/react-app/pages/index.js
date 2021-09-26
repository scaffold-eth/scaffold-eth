import React from "react";
import { Web3Consumer } from "../helpers/Web3Context";

function Home({ web3 }) {
  console.log(`Message from home component`, web3);

  return (
    <div className="flex flex-1 h-screen w-full items-center justify-center">
      <div className="text-center">
        <span>This App is powered by Scaffold-eth & Next.js!</span>
        <br />
        <span>
          Added{" "}
          <a href="https://tailwindcss.com/" target="_blank">
            TailwindCSS
          </a>{" "}
          for easier styling.
        </span>
      </div>
    </div>
  );
}

export default Web3Consumer(Home);
