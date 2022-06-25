import chai from "chai";
import { chaiEthers } from "chai-ethers";
import { solidity } from "ethereum-waffle";
chai.use(solidity);
chai.use(chaiEthers);
const { expect } = chai;

export { expect };
