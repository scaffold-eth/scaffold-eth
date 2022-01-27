//const db = require("./dbFirebase");
const db = require("./dbLocal");

const createDistribution = db.createDistribution;
const finishDistribution = db.finishDistribution;
const currentDistribution = db.currentDistribution;
const findAllDistributions = db.findAllDistributions;
const votingDistributions = db.votingDistributions;
const ownedDistributions = db.ownedDistributions;
const getDistribution = db.getDistribution;
const updateDistribution = db.updateDistribution;

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