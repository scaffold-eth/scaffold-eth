/* eslint-disable jsx-a11y/accessible-emoji */

import { SyncOutlined } from "@ant-design/icons";
import { formatEther, parseEther } from "@ethersproject/units";
import { Button, Card, DatePicker, Divider, Input, List, Progress, Slider, Spin, Switch, Avatar } from "antd";
import React, { useCallback, useEffect, useState } from "react";
import { Address, Balance } from "../components";
import { EditOutlined, EllipsisOutlined, SettingOutlined } from '@ant-design/icons';
import { useContractReader, useEventListener } from "../hooks";
import StackGrid from "react-stack-grid";
import Blockies from "react-blockies";
import {
  BrowserRouter as Router,
  Route,
  Link,
  useParams
} from "react-router-dom";

const { BufferList } = require("bl");
const ipfsAPI = require("ipfs-http-client");
const ipfs = ipfsAPI({ host: "ipfs.infura.io", port: "5001", protocol: "https" });
const { Meta } = Card;

const getFromIPFS = async hashToGet => {
  for await (const file of ipfs.get(hashToGet)) {
    //console.log(file.path);
    if (!file.content) continue;
    const content = new BufferList();
    for await (const chunk of file.content) {
      content.append(chunk);
    }
    console.log("CONT",content);
    return content;
  }
};

export default function Collections({
  purpose,
  setPurposeEvents,
  address,
  mainnetProvider,
  userProvider,
  localProvider,
  yourLocalBalance,
  price,
  tx,
  readContracts,
  writeContracts,
  targetNetwork,
}) {

  let { collectionId } = useParams();
  let cardsInPool= useContractReader(readContracts, "Collections", "getCardsArray", [collectionId], 100);

  const blockExplorer = targetNetwork.blockExplorer;
  //
  // 🧠 This effect will update yourCollectibles by polling when your balance changes
  //

  // 📟 Listen for broadcast events
  // const setCardsEvents = useEventListener(readContracts, "Collections", "CardAdded", localProvider, 1);
  // setCardsEvents.forEach(card => {
  //   console.log(card[0]);
  // });

  const numberCardsInPool = cardsInPool!=null ? cardsInPool.length : 0;
  //console.log("amount", numberCardsInPool);
  const [cards, setCards] = useState();

  useEffect(() => {
    const updateCards = async () => {
      const cardsUpdate = [];
    
      for (let cardsIndex = 0; cardsIndex < numberCardsInPool; cardsIndex++) {
        try {
          const cardId = cardsInPool[cardsIndex].id;
          let uri = await readContracts.Collectible.uri(0); //All tokens have the same base uri
          uri = uri.replace(/{(.*?)}/, cardId);

          const ipfsHash = uri.replace("https://ipfs.io/ipfs/", "");

          const jsonManifestBuffer = await getFromIPFS(ipfsHash);

          try {
            const jsonManifest =JSON.parse(jsonManifestBuffer.toString());
            cardsUpdate.push({ id: cardId.toNumber(), name: jsonManifest.name, description: jsonManifest.description, image:jsonManifest.image });
          } catch (e) {
            console.log(e);
          }


          //const staked = await readContracts.Collections.balanceOf(address,collectionIndex);

          
          
          /*
          const ipfsHash = tokenURI.replace("https://ipfs.io/ipfs/", "");
          console.log("ipfsHash", ipfsHash);

          const jsonManifestBuffer = await getFromIPFS(ipfsHash);

          try {
            const jsonManifest = JSON.parse(jsonManifestBuffer.toString());
            console.log("jsonManifest", jsonManifest);
            collectibleUpdate.push({ id: tokenId, uri: tokenURI, owner: address, ...jsonManifest });
          } catch (e) {
            console.log(e);
          }
          */
        } catch (e) {
          console.log(e);
        }
      }
      setCards(cardsUpdate);
    };
    updateCards();
  }, [numberCardsInPool]);

  let galleryList = []

  for(let i in cards){
    galleryList.push(
      <Card
        style={{ width: 300 }}
        cover={
          <img
            alt="example"
            src={cards[i].image}
          />
        }
        actions={[
          <EditOutlined key="edit" />,
        ]}
      >
        <Meta
          title={cards[i].name}
          description={cards[i].description}
        />
      </Card>
    )
  }

  const [newPurpose, setNewPurpose] = useState("loading...");

  return (
    <div>
      <div style={{ width: 996, margin: "auto", marginTop: 32, paddingBottom: 32, marginBottom:32 }}>
      <h2>Cards in collection #{collectionId}: {numberCardsInPool}</h2>
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
