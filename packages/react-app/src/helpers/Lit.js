import LitJsSdk from "lit-js-sdk";

const client = new LitJsSdk.LitNodeClient();
const chain = "ethereum";

const accessControlConditions = [
  {
    contractAddress: "",
    standardContractType: "",
    chain,
    method: "",
    parameters: [":userAddress"],
    returnValueTest: {
      comparator: "=",
      value: "0xA4ca1b15fE81F57cb2d3f686c7B13309906cd37B",
    },
  },
];

class Lit {
  litNodeClient;

  async connect() {
    await client.connect();
    this.litNodeClient = client;
  }

  async encryptString(string) {
    if (!this.litNodeClient) {
      await this.connect();
    }
    const authSig = await LitJsSdk.checkAndSignAuthMessage({ chain });
    console.log("Encrypting key pair", string);
    const { encryptedString, symmetricKey } = await LitJsSdk.encryptString(string);
    console.log("Encrypted the key pair");
    const encryptedSymmetricKey = await this.litNodeClient.saveEncryptionKey({
      accessControlConditions: accessControlConditions,
      symmetricKey,
      authSig,
      chain,
    });

    return {
      encryptedFile: encryptedString,
      encryptedSymmetricKey: LitJsSdk.uint8arrayToString(encryptedSymmetricKey, "base16"),
    };
  }

  async decryptString(encryptedStr, encryptedSymmetricKey) {
    if (!this.litNodeClient) {
      await this.connect();
    }
    const authSig = await LitJsSdk.checkAndSignAuthMessage({ chain });
    const symmetricKey = await this.litNodeClient.getEncryptionKey({
      accessControlConditions: accessControlConditions,
      toDecrypt: encryptedSymmetricKey,
      chain,
      authSig,
    });
    const decryptedFile = await LitJsSdk.decryptString(encryptedStr, symmetricKey);
    // eslint-disable-next-line no-console
    console.log({
      decryptedFile,
    });
    return decryptedFile;
  }
}

export default new Lit();
