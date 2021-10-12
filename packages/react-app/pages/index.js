import React, { useContext } from "react";
import { Web3Context } from "../helpers/Web3Context";

function Home() {
  const context = useContext(Web3Context);

  console.log(`🗄 context context:`, context);

  return (
    <div className="flex flex-1 flex-col h-screen w-full items-center">
      <div className="text-center" style={{ margin: 64 }}>
        <span>This App is powered by Scaffold-eth & Next.js </span>
        <span>and is ready for your next Moonshot!!</span>
        <br />
        <span>
          Added{" "}
          <a href="https://tailwindcomponents.com/cheatsheet/" target="_blank" rel="noreferrer">
            TailwindCSS
          </a>{" "}
          for easier styling.
        </span>
      </div>
    </div>
  );
}

export default Home;
