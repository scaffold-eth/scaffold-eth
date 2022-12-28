import { ethers } from "ethers";
import { getRPCPollTime, Transactor, Web3ModalSetup } from "../helpers";

let counter = 0;

export default async function GameLoop({ provider, address, setTheState }) {
  let faucetTx = Transactor(provider, null, null, true);
  console.log("🔖 address", address);

  let balance = await provider.getBalance(address);
  console.log("balance", balance);
  if (balance.gt(0)) {
    counter++;
    setTheState("⏳ render " + counter);
  } else {
    faucetTx({
      to: address,
      value: ethers.utils.parseEther("0.01"),
    });

    setTheState("⏳ dripping funds...");
  }
}
