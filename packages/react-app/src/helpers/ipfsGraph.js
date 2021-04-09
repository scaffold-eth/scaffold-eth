const ipfsAPI = require("ipfs-http-client");

// run your own ipfs daemon: https://docs.ipfs.io/how-to/command-line-quick-start/#install-ipfs
// const localhost = { host: "localhost", port: "5001", protocol: "http" };

const ipfs = (graphUrl) => {
  const ipfsNodeConfig = { 
    url: graphUrl, 
    // headers: {
    //   authorization: 'Bearer ' +  TOKEN
    // }
  };

  const ipfsGateway = ipfsAPI(ipfsNodeConfig);

    const addOptions = {
      pin: true,
    };

  const addJson = async (jsonObj) => {
    const res = await ipfsGateway.add(JSON.stringify(jsonObj), addOptions);
    console.log(res);
    return res;
  }


  return {
    ipfs: ipfsGateway,
    addJson: addJson
  }
}


// const addOptions = {
//   pin: true,
// };

// const addJson = async (jsonObj) => {
//   try{
//     const response = await ipfs.add(JSON.stringify(jsonObj), addOptions);
//     console.log(response);
//   } catch (e) {
//     console.log(e);
//   }
// }

// const testJson = {
//     "description": "Good Token IPFS test to see if can read in to GraphQL", 
//     "external_url": "https://openseacreatures.io/3", 
//     "image": "https://storage.googleapis.com/opensea-prod.appspot.com/puffs/3.png", 
//     "name": "Good Token"
// };

// addJson(testJson);

exports.default = ipfs
