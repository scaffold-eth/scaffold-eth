"use strict";

const fs = require("fs");
const path = require("path");
const isLocal = typeof process.pkg === "undefined";
const basePath = isLocal ? process.cwd() : path.dirname(process.execPath);
const layersDir = `${basePath}/layers`;

const { layerConfigurations } = require("../src/config.js");

const { getElements } = require("../src/main.js");

// read json data
let rawdata = fs.readFileSync(`${basePath}/build/json/_metadata.json`);
let data = JSON.parse(rawdata);
let editionSize = data.length;

let rarityData = [];

// intialize layers to chart
layerConfigurations.forEach((config) => {
  let layers = config.layersOrder;

  layers.forEach((layer) => {
    // get elements for each layer
    let elementsForLayer = [];
    let elements = getElements(`${layersDir}/${layer.name}/`);
    elements.forEach((element) => {
      // just get name and weight for each element
      let rarityDataElement = {
        trait: element.name,
        chance: element.weight.toFixed(0),
        occurrence: 0, // initialize at 0
      };
      elementsForLayer.push(rarityDataElement);
    });

    // don't include duplicate layers
    if (!rarityData.includes(layer.name)) {
      // add elements for each layer to chart
      rarityData[layer.name] = elementsForLayer;
    }
  });
});

// fill up rarity chart with occurrences from metadata
data.forEach((element) => {
  let attributes = element.attributes;

  attributes.forEach((attribute) => {
    let traitType = attribute.trait_type;
    let value = attribute.value;

    let rarityDataTraits = rarityData[traitType];
    rarityDataTraits.forEach((rarityDataTrait) => {
      if (rarityDataTrait.trait == value) {
        // keep track of occurrences
        rarityDataTrait.occurrence++;
      }
    });
  });
});

// convert occurrences to percentages
for (var layer in rarityData) {
  for (var attribute in rarityData[layer]) {
    // convert to percentage
    rarityData[layer][attribute].occurrence =
      (rarityData[layer][attribute].occurrence / editionSize) * 100;

    // show two decimal places in percent
    rarityData[layer][attribute].occurrence =
      rarityData[layer][attribute].occurrence.toFixed(0);
  }
}

// print out rarity data
for (var layer in rarityData) {
  console.log(`Trait type: ${layer}`);
  for (var trait in rarityData[layer]) {
    console.log(rarityData[layer][trait]);
  }
  console.log();
}
