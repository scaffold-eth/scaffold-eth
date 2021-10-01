const firebaseAdmin = require("firebase-admin");

/*
const firebaseServiceAccount = require("../firebaseServiceAccountKey.json");

firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.cert(firebaseServiceAccount),
});
*/

firebaseAdmin.initializeApp({
  credential: admin.credential.applicationDefault()
});

// Docs: https://firebase.google.com/docs/firestore/quickstart#node.js_1
const database = firebaseAdmin.firestore();

const createDistribution = async (data) => {
  return await database.collection('distributions').add(data);
};

const finishDistribution = async (id) => {
  const distributionRef = database.collection('distributions').doc(id);
  return distributionRef.update({status: 'finished'});
};

const currentDistribution = async () => {
  const snapshot = await database.collection('distributions')
    .where('status', '==', 'started')
    .get();

  if(!snapshot.empty) {
    return { id: snapshot.docs[0].id, ...snapshot.docs[0].data() };
  } else {
    return false;
  }
};

const findAllDistributions = async () => {
  const snapshot = await database.collection('distributions').get();

  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

const getDistribution = async (id) => {
  const distributionRef = database.collection('distributions').doc(id);
  const distribution = await distributionRef.get();

  if (!distribution.exists) {
    return false;
  }
  return { id: distribution.id, ...distribution.data() };
};

const votingDistributions = async (voter) => {
  const snapshot = await database.collection('distributions').where('members', 'array-contains', voter).get();

  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

const ownedDistributions = async (owner) => {
  const snapshot = await database.collection('distributions').where('owner', '==', owner).get();

  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

const updateDistribution = async (id, data) => {
  const distributionRef = database.collection('distributions').doc(id);
  return distributionRef.update(data);
};

module.exports = {
  createDistribution,
  finishDistribution,
  currentDistribution,
  findAllDistributions,
  votingDistributions,
  ownedDistributions,
  getDistribution,
  updateDistribution,
};