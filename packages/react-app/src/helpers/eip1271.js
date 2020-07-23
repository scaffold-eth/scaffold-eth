import { Contract, providers, utils } from "ethers";

const spec = {
  magicValue: "0x1626ba7e",
  abi: [
    {
      constant: true,
      inputs: [
        {
          name: "_hash",
          type: "bytes32",
        },
        {
          name: "_sig",
          type: "bytes",
        },
      ],
      name: "isValidSignature",
      outputs: [
        {
          name: "magicValue",
          type: "bytes4",
        },
      ],
      payable: false,
      stateMutability: "view",
      type: "function",
    },
  ],
};

export async function isValidSignature(
  address: string,
  sig: string,
  data: string,
  provider: providers.Provider,
  abi = spec.abi,
  magicValue = spec.magicValue,
) {
  let returnValue;
  try {
    let contract = new Contract(address, abi, provider)
    console.log(contract)
    returnValue = await contract.isValidSignature(
      utils.arrayify(data),
      sig,
    );
    console.log('returnValue', returnValue)
  } catch (e) {
    console.log(e)
    return false;
  }
  return returnValue.toLowerCase() === magicValue.toLowerCase();
}
