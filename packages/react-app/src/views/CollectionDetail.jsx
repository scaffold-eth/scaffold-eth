/* eslint-disable jsx-a11y/accessible-emoji */

import { SyncOutlined } from "@ant-design/icons";
import { formatEther, parseEther } from "@ethersproject/units";
import { Button, Card, DatePicker, Divider, Input, List, Progress, Slider, Spin, Switch, Avatar } from "antd";
import { Row, Col } from 'antd';
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

  let collectionsAddress = readContracts ? readContracts.Collections.address : readContracts

  let cardsInPool= useContractReader(readContracts, "Collections", "getCardsArray", [collectionId], 10000);
  let myAllowance= useContractReader(readContracts, "EMEMToken", "allowance", [address, collectionsAddress], 1000);

  const blockExplorer = targetNetwork.blockExplorer;

  let numberMyAllowance = myAllowance!=null ? myAllowance : 0;

  const numberCardsInPool = cardsInPool!=null ? cardsInPool.length : 0;
  //console.log("amount", numberCardsInPool);
  const [cards, setCards] = useState();
  const [allowance, setAllowance] = useState("loading..."); 

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

        } catch (e) {
          console.log(e);
        }
      }
      setCards(cardsUpdate);
    };
    updateCards();
  }, [numberCardsInPool]);

  const [myStake, setMyStake] = useState("loading...");

  useEffect(() => {
    const fetchStake = async () => {
      setMyStake(readContracts ? formatEther(await readContracts.Collections.balanceOf(address,collectionId)) : 0);
      console.log("My Stake:", myStake);
    };
    fetchStake();
  },[myStake,readContracts, yourLocalBalance]);

  // useEffect(() => {
  //   setMyStake(readContracts ? formatEther(readContracts.Collections.balanceOf(address,collectionId)) : 0);
  //     console.log("My Stake:", myStake);
  // },[myStake, readContracts]);

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

  const [stake, setStake] = useState("loading...");

  function StakeButton(props){
    return(
      <Button
        onClick={() => {
          /* look how you call setPurpose on your contract: */
          tx(writeContracts.Collections.stake(collectionId, stake));
        }}
      >
        Stake
      </Button>
    );
  }

  function ApproveButton(props){
    return(
      <Button
        onClick={() => {
          /* look how you call setPurpose on your contract: */
          tx(writeContracts.EMEMToken.approve(collectionsAddress, parseEther("999999")));
        }}
      >
        Approve EMEM Token
      </Button>
    );
  }

  function ShowButton(props) {
    if(numberMyAllowance > 0)
      return <StakeButton />;
    else
      return <ApproveButton />;
  }

  return (
    <div>
      <div style={{ width: 996, margin: "auto", marginTop: 32, paddingBottom: 32, marginBottom:32 }}>
      <h2>Cards in collection #{collectionId}: {numberCardsInPool}</h2>

      <Row>
        <Col span={12}>
          <h2>Staked: {myStake}</h2>
        </Col>
        <Col span={12}>
          <h2>Points: 3321</h2>
        </Col>
      </Row>

      <div style={{ margin: 8 }}>
          <Input
            onChange={e => {
              setStake(e.target.value);
            }}
          />
          <ShowButton />
        </div>  

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
