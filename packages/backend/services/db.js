//const db = require("./dbFirebase");
const db = require("./dbLocal");

const countClaims = db.countClaims;
const createClaim = db.createClaim;
const claimByTokenId = db.claimByTokenId;
const updateClaim = db.updateClaim;
const getClaim = db.getClaim;
const updateClaimByTokenId = db.updateClaimByTokenId;
const getClaimedByTokenId = db.getClaimedByTokenId;
const claimsByAddress = db.claimsByAddress;

module.exports = {
  countClaims,
  createClaim,
  claimByTokenId,
  updateClaim,
  getClaim,
  updateClaimByTokenId,
  getClaimedByTokenId,
  claimsByAddress,
};