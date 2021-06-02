/* eslint-disable jsx-a11y/accessible-emoji */
import { Card, Badge } from "antd";
import React, {useEffect, useState } from "react";
import { useContractReader } from "../hooks";
import StackGrid from "react-stack-grid";
const { BufferList } = require("bl");
const ipfsAPI = require("ipfs-http-client");
const ipfs = ipfsAPI({ host: "ipfs.infura.io", port: "5001", protocol: "https" });
const { Meta } = Card;

const getFromIPFS = async hashToGet => {
  for await (const file of ipfs.get(hashToGet)) {
    if (!file.content) continue;
    const content = new BufferList();
    for await (const chunk of file.content) {
      content.append(chunk);
    }
    return content;
  }
};

export default function MyCollectibles({
  address,
  readContracts,
}) {

  let collectiblesCount = useContractReader(readContracts, "Collectible", "getCurrentTokenID", null, 1000);
  const numberCollectiblesCount = collectiblesCount && collectiblesCount.toNumber && collectiblesCount.toNumber();
  const [collectibles, setCollectibles] = useState();

  useEffect(() => {
    const updateCollectibles = async () => {
      const collectiblesUpdate = [];
    
      for (let collectibleIndex = 1; collectibleIndex <= numberCollectiblesCount; collectibleIndex++) {
        try {
          let tokenSupply = await readContracts.Collectible.tokenSupply(collectibleIndex);
          let owned = await readContracts.Collectible.balanceOf(address, collectibleIndex);

          let uri = await readContracts.Collectible.uri(0); //All tokens have the same base uri
          uri = uri.replace(/{(.*?)}/, collectibleIndex);
          const ipfsHash = uri.replace("https://ipfs.io/ipfs/", "");
          const jsonManifestBuffer = await getFromIPFS(ipfsHash);

          try {
            const jsonManifest =JSON.parse(jsonManifestBuffer.toString());
            collectiblesUpdate.push({ id: collectibleIndex, supply:tokenSupply, owned:owned, name: jsonManifest.name, description: jsonManifest.description, image:jsonManifest.image });
          } catch (e) {
            console.log(e);
          }

        } catch (e) {
          console.log(e);
        }
      }
      setCollectibles(collectiblesUpdate);
    };
    updateCollectibles();
  }, [numberCollectiblesCount]);

  let galleryList = []

  for(let i in collectibles){
    galleryList.push(
      <Badge.Ribbon 
      text={collectibles[i].owned + " owned of " + collectibles[i].supply + " minted"}>
        <Card
          key={collectibles[i].id}
          style={{ width: 300 }}
          cover={
            <img
              alt="example"
              src={collectibles[i].image}
            />
          }
        >
          <Meta
            title={collectibles[i].name}
            description={collectibles[i].description}
          />
        </Card>
        </Badge.Ribbon>
    )
  }

  return (
    <div>
      <div style={{ width: 996, margin: "auto", marginTop: 32, paddingBottom: 32, marginBottom:32 }}>
      <h2>Tokens in all collections: {numberCollectiblesCount}</h2>
        <StackGrid
            columnWidth={300}
            gutterWidth={16}
            gutterHeight={16}
        >
         {galleryList} 
        </StackGrid>
      </div>
    </div>
  );
}
