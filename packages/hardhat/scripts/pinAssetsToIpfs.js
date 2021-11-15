/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
const pinataSDK = require("@pinata/sdk");

let hash;

const pinata = pinataSDK(
  "99fcf586ed3246c770cf",
  "ee4d02abc590616bea734479d7c087e16bef5254b6d0083c39fa91266eccdaf3"
);
const fs = require("fs");

const pinFile = async (path) => {
  const strmFile = fs.createReadStream(path);
  const result = await pinata.pinFileToIPFS(strmFile);

  return result.IpfsHash;
};

const main = async (params) => {
  // read images
  const imageFiles = fs.readdirSync("./images");
  console.log("image files: ", imageFiles);

  // loop through the images and pin to pinata
  for (const image of imageFiles) {
    const [index] = image.split(".");
    // if (index > 0 && index < 1000) {
    try {
      hash = await pinFile(`./images/${image}`);

      // load metadata for image as JSON object
      const metaDataPath = `./json/${index}.json`;
      const indexMetaData = JSON.parse(
        fs.readFileSync(metaDataPath).toString()
      );
      // add hash to JSON object
      indexMetaData.image = "https://pharo.mypinata.cloud/ipfs/" + hash;

      // write meta data back to file (Optional: You can write JSON directly to IPFS)
      fs.writeFileSync(metaDataPath, JSON.stringify(indexMetaData));

      console.log(`Write for image ${index}: IPFS Hash is ${hash}`);
    } catch (error) {
      console.error(error);
    }
    // }
  }

  // upload JSON folder to IPFS here
  const options = {
    pinataMetadata: {
      name: "Pharo",
      keyvalues: {
        series: "1",
        minted: "11/2021",
      },
    },
    pinataOptions: {
      cidVersion: 0,
    },
  };

  pinata
    .pinFromFS("./json", options)
    .then((result) => {
      // handle results here
      console.log(result);
    })
    .catch((err) => {
      // handle error here
      console.log(err);
    });
};

main();
