import { ethers } from "ethers";
import { getRPCPollTime, Transactor, Web3ModalSetup } from "../helpers";

let counter = 0;

let cars = [];

// the game loop will be full of different agents with different strategies

export default async function GameLoop({ provider, address, setTheState }) {
  let faucetTx = Transactor(provider, null, null, true);
  console.log("🔖 address", address);

  let balance = await provider.getBalance(address);
  console.log("balance", balance);

  // keep the player full of eth for gas
  if (balance.gt(ethers.utils.parseEther("0.1"))) {
    counter++;

    //provider.ag

    //setTheState("⏳ render " + counter);
  } else {
    faucetTx({
      to: address,
      value: ethers.utils.parseEther("0.1"),
    });

    setTheState("⏳ dripping funds...");
  }
}
