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

const countDistributions = () => {
  return Object.entries(database).length;
};

const createDistribution = (data) => {
  const id = countDistributions() + 1;
  database[id] = data;
  persist();
  return { id: id, ...data };
};

const finishDistribution = async (id) => {
  database[id].status = 'finished';

  persist();

  return getDistribution(id);
};

const currentDistribution = () => {
  const current = Object.entries(database).find(([id, data]) => data.status === 'started');
  if (current) {
    return { id: current[0], ...current[1] };
  }
  return false;
};

const findAllDistributions = () => {
  console.log(database);
  return Object.entries(database).map(([id, data]) => ({ id, ...data }));
};

const getDistribution = (id) => {
  if (database[id]) {
    return { id: id, ...database[id] };
  }
  return false;
};

const votingDistributions = (voter) => {
  return Object.entries(database).filter(([id, data]) => data.members.includes(voter)).map(([id, data]) => ({ id, ...data }));
};

const ownedDistributions = (owner) => {
  return Object.entries(database).filter(([id, data]) => data.owner === owner).map(([id, data]) => ({ id, ...data }));
};

const updateDistribution = (id, data) => {
  const { _id, ...existingData } = getDistribution(id)

  database[id] = {
    ...existingData,
    ...data,
  };

  persist();

  return getDistribution(id);
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