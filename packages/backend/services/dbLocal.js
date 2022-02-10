const fs = require("fs");

const DATABASE_PATH = "./local_database/local_db.json";

if (!fs.existsSync(DATABASE_PATH)) {
  const file = fs.openSync(DATABASE_PATH, "w");
  fs.writeFileSync(file, JSON.stringify({}, null, 2));
  fs.closeSync(file);
}

const database = JSON.parse(fs.readFileSync(DATABASE_PATH, "utf8"));

const persist = () => {
  const file = fs.openSync(DATABASE_PATH, "w");
  fs.writeFileSync(file, JSON.stringify(database, null, 2));
  fs.closeSync(file);
};

const createClaim = (data) => {
  const id = countClaims() + 1;
  database[id] = data;
  persist();
  return { id: id, ...data };
};

const claimByTokenId = (tokenId) => {
  const claim = Object.entries(database).find(([id, data]) => data.tokenId === tokenId);
  if (claim) {
    return { id: claim[0], ...claim[1] };
  }
  return false;
};

const getClaimedByTokenId = (tokenId) => {
  const { id, ...existingData } = claimByTokenId(tokenId)

  if (id) {
    return existingData.claimed;
  }

  return true;
}

const getClaim = (id) => {
  if (database[id]) {
    return { id: id, ...database[id] };
  }
  return false;
};

const claimsByAddress = (address) => {
  return Object.entries(database).filter(([id, data]) => data.address === address).map(([id, data]) => ({ id, ...data }));
};

const updateClaimByTokenId = (tokenId, data) => {
  const { id, ...existingData } = claimByTokenId(tokenId)

  database[id] = {
    ...existingData,
    ...data,
  };

  persist();

  return getClaim(id);
};

const updateClaim = (id, data) => {
  const { _id, ...existingData } = getClaim(id)

  database[id] = {
    ...existingData,
    ...data,
  };

  persist();

  return getClaim(id);
};

const findAllClaims = () => {
  return Object.entries(database).map(([id, data]) => ({ id, ...data }));
};

const findAllClaimed = () => {
  return Object.entries(database).filter(([id, data]) => data.claimed === true).map(([id, data]) => ({ id, ...data }));
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