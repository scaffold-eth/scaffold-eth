import { time } from "console";
import { Contract } from "ethers";
import { deployments, ethers, getNamedAccounts, getUnnamedAccounts } from "hardhat";
/**
 *
 * @param addresses array of unnamed addresses provided my hardhat
 * @param contracts contract to be attached to each address
 * @returns  array of addresses with contracts connected to each
 */
export async function setupUsers<T extends { [contractName: string]: Contract }>(
  addresses: string[],
  contracts: T
): Promise<({ address: string } & T)[]> {
  const users: ({ address: string } & T)[] = [];
  for (const address of addresses) {
    users.push(await setupUser(address, contracts));
  }
  return users;
}

/**
 * @dev function attaches address and each contract, in the contract object, to user
 * @param address address of user
 * @param contracts object containing each contract to attach to user
 * @returns  object, with each address attached/connected as a signer to the contract instance
 */
export async function setupUser<T extends { [contractName: string]: Contract }>(
  address: string,
  contracts: T
): Promise<{ address: string } & T> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const user: any = { address };
  for (const key of Object.keys(contracts)) {
    user[key] = contracts[key].connect(await ethers.getSigner(address));
  }
  return user as { address: string } & T;
}

// we create a setup function that can be called by every test and setup variable for easy to read tests
export async function setup() {
  const { get, fixture } = deployments;
  // it first ensures the deployment is executed and reset (use of evm_snapshot for faster tests)
  await fixture(["GovToken", "TimeLock", "Governor", "PetroStake"]); //Promise<{[name: string]: Deployment}>;

  // we get an instantiated contract in the form of a ethers.js Contract instance:
  const contracts = {
    //if there are no signers avail, getContractAt returns read-only contracts
    GovToken: await ethers.getContractAt("GovToken", (await get("GovToken")).address),
    TimeLock: await ethers.getContractAt("TimeLock", (await get("TimeLock")).address),
    Governor: await ethers.getContractAt("Governor", (await get("Governor")).address),
    PetroStake: await ethers.getContractAt("PetroStake", (await get("PetroStake")).address),
  };

  // Get the unnammedAccounts (which are basically all accounts not named in the config,
  // We then use the utilities function to generate user objects
  // These object allow you to write things like `users[0].Petrostake.createContract(....)`
  const { deployer } = await getNamedAccounts();
  const hhAcounts = await getUnnamedAccounts();
  hhAcounts.unshift(deployer);
  const signers = await setupUsers(hhAcounts, contracts);
  // finally we return the whole object (including the tokenOwner setup as a User object)
  return {
    ...contracts,
    signers,
  };
}

// `describe` is a Mocha function that allows you to organize your tests. It's
// not actually needed, but having your tests organized makes debugging them
// easier. All Mocha functions are available in the global scope.

// `describe` receives the name of a section of your test suite, and a callback.
// The callback must define the tests of that section. This callback can't be
// an async function.
