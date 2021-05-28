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
const { Meta } = Card;

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
  const poolsCount2 = useContractReader(readContracts, "Collections", "poolsCount", null, 100);

  const blockExplorer = targetNetwork.blockExplorer;
  //
  // 🧠 This effect will update yourCollectibles by polling when your balance changes
  //
  const numberPoolsCount = poolsCount2 && poolsCount2.toNumber && poolsCount2.toNumber();
  const [collections, setCollections] = useState();

  useEffect(() => {
    const updateCollections = async () => {
      const collectionsUpdate = [];
    
      for (let collectionIndex = 0; collectionIndex < numberPoolsCount; collectionIndex++) {
        try {
          const pool = await readContracts.Collections.pools(collectionIndex);
          const staked = await readContracts.Collections.balanceOf(address,collectionIndex);

          collectionsUpdate.push({ id: collectionIndex, artist: pool.artist, title: pool.title, staked: staked});
          
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
      setCollections(collectionsUpdate);
    };
    updateCollections();
  }, [numberPoolsCount]);

  let galleryList = []

  for(let i in collections){
    galleryList.push(
      <Card
        style={{ width: 300 }}
        cover={
          <img
            alt="example"
            src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
          />
        }
        actions={[
          <h4>Staked: {formatEther(collections[i].staked)}</h4>,
          <EditOutlined key="edit" />,
        ]}
      >
        <Meta
          avatar={<Blockies seed={collections[i].artist.toLowerCase()} size={8} scale={3} />}
          title={collections[i].artist}
          description={collections[i].title}
        />
      </Card>
    )
  }

  const [newPurpose, setNewPurpose] = useState("loading...");

  return (
    <div>
      <div style={{ width: 996, margin: "auto", marginTop: 32, paddingBottom: 32, marginBottom:32 }}>
      <h2>Cards in collection #{collectionId}: {numberPoolsCount}</h2>
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
