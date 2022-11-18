const constants = require("./constants");

const IPFSStorage = (exports.IPFSStorage = require("./ipfs"));

const AkordStorage = (exports.AkordStorage = require("./akord"));

exports.createStorage = function (options) {
  options = options || {};
  const backend = options.backend || constants.backend;
  const Storage = backend === "ipfs" ? IPFSStorage : AkordStorage;
  if (options.readOnly) {
    return Storage.createReadOnly();
  }
  return Storage.create();
};
