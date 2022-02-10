//const db = require("./dbFirebase");
const db = require("./dbLocal");

const createClaim = db.createClaim;
const claimByTokenId = db.claimByTokenId;
const updateClaim = db.updateClaim;
const getClaim = db.getClaim;
const updateClaimByTokenId = db.updateClaimByTokenId;
const getClaimedByTokenId = db.getClaimedByTokenId;
const claimsByAddress = db.claimsByAddress;
const findAllClaims = db.findAllClaims;
const findAllClaimed = db.findAllClaimed;

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