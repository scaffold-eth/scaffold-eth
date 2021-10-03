"use strict";

const fs = require("fs");
const path = require("path");
const isLocal = typeof process.pkg === "undefined";
const basePath = isLocal ? process.cwd() : path.dirname(process.execPath);

const { baseUri } = require("../src/config.js");

// read json data
let rawdata = fs.readFileSync(`${basePath}/build/json/_metadata.json`);
let data = JSON.parse(rawdata);

data.forEach((item) => {
  item.image = `${baseUri}/${item.edition}.png`;
  fs.writeFileSync(
    `${basePath}/build/json/${item.edition}.json`,
    JSON.stringify(item, null, 2)
  );
});

fs.writeFileSync(
  `${basePath}/build/json/_metadata.json`,
  JSON.stringify(data, null, 2)
);

console.log(`Updated baseUri for images to ===> ${baseUri}`);
