const firebaseAdmin = require("firebase-admin");

const firebaseServiceAccount = require("../optimisticloogiesclaim-1ec34476e878.json");

firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.cert(firebaseServiceAccount),
});

/*
firebaseAdmin.initializeApp({
  credential: admin.credential.applicationDefault()
});
*/

// Docs: https://firebase.google.com/docs/firestore/quickstart#node.js_1
const database = firebaseAdmin.firestore();

const createClaim = async (data) => {
  return await database.collection('claims').add(data);
};

const claimByTokenId = async (tokenId) => {
  const snapshot = await database.collection('claims')
    .where('tokenId', '==', tokenId)
    .get();

  if(!snapshot.empty) {
    return { id: snapshot.docs[0].id, ...snapshot.docs[0].data() };
  } else {
    return false;
  }
};

const getClaimedByTokenId = async (tokenId) => {
  const { id, ...existingData } = await claimByTokenId(tokenId)

  if (id) {
    return existingData.claimed;
  }

  return true;
}

const findAllClaims = async () => {
  const snapshot = await database.collection('claims').get();

  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

const findAllClaimed = async () => {
  const snapshot = await database.collection('claims').where('claimed', '==', true).get();

  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

const getClaim = async (id) => {
  const claimRef = database.collection('claims').doc(id);
  const claim = await claimRef.get();

  if (!claim.exists) {
    return false;
  }
  return { id: claim.id, ...claim.data() };
};

const claimsByAddress = async (address) => {
  const snapshot = await database.collection('claims').where('address', '==', address).get();

  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

const updateClaimByTokenId = async (tokenId, data) => {
  const { id, ..._existingData } = await claimByTokenId(tokenId)

  return updateClaim(id, data);
};

const updateClaim = async (id, data) => {
  const claimRef = database.collection('claims').doc(id);
  return claimRef.update(data);
};

module.exports = {
  createClaim,
  claimByTokenId,
  updateClaim,
  getClaim,
  updateClaimByTokenId,
  getClaimedByTokenId,
  claimsByAddress,
  findAllClaims,
  findAllClaimed,
};