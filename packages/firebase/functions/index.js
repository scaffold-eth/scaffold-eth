const functions = require("firebase-functions");
const admin = require("firebase-admin");
const ethers = require("ethers");
admin.initializeApp();

const db = admin.firestore();

const handleRecovery = (types, value, signature) => {
  return ethers.utils.verifyTypedData(
    {
      name: "POEMS",
      version: "1",
      chainId: 4,
      verifyingContract: "0x5D8326b0249666df7BDB3593EaAE4449Ada5Ff6e",
    },
    types,
    value,
    signature
  );
};

exports.createPoem = functions.https.onCall((data) => {
  const { signature, value } = data;

  // TODO : Validate value fields here

  const recovered = handleRecovery(
    {
      Poem: [
        { name: "poet", type: "address" },
        { name: "amount", type: "uint256" },
        { name: "title", type: "string" },
        { name: "poem", type: "string" },
      ],
    },
    value,
    signature
  );

  if (!ethers.utils.isAddress(recovered)) {
    throw new Error("Invalid signer");
  }

  const update = Object.assign(
    {},
    {
      creator: recovered,
      data: value,
      signature,
      _createdAt: admin.firestore.FieldValue.serverTimestamp(),
    }
  );

  // use recovered address to create a new board
  const doc = db.collection("poems").doc();

  doc.set(update);

  return doc.id;
});
