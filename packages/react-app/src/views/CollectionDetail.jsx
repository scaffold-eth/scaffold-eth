/* eslint-disable jsx-a11y/accessible-emoji */
import { formatEther, parseEther } from "@ethersproject/units";
import { Button, Card, Input, Badge } from "antd";
import { Row, Col } from 'antd';
import React, { useEffect, useState } from "react";
import { useContractReader } from "../hooks";
import StackGrid from "react-stack-grid";
import { BigNumber } from "@ethersproject/bignumber";
import {
  BrowserRouter as Router,
  useParams
} from "react-router-dom";

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

export default function Collections({
  address,
  yourLocalBalance,
  tx,
  readContracts,
  writeContracts,
}) {

  let { collectionId } = useParams();

  let collectionsAddress = readContracts ? readContracts.Collections.address : readContracts

  let cardsInPool= useContractReader(readContracts, "Collections", "getCardsArray", [collectionId],10000);
  let myAllowance= useContractReader(readContracts, "EMEMToken", "allowance", [address, collectionsAddress],10000);
  let poolData= useContractReader(readContracts, "Collections", "pools", [collectionId],10000);
  let numberMyAllowance = myAllowance!=null ? myAllowance : 0;

  const numberCardsInPool = cardsInPool!=null ? cardsInPool.length : 0;
  const [cards, setCards] = useState();
  const [collectionName, setCollectionName] = useState(" ");
  const [myStake, setMyStake] = useState(" ");
  const [myPoints, setMyPoints] = useState(BigNumber.from("0"));
  const [lastUpdate, setLastUpdate] = useState(-1);
  const [runCounter, setRunCounter] = useState(false);
  const [counter, setCounter] = useState(0);
  const [calculatedAccruedPoints, setCalculatedAccruedPoints] = useState(BigNumber.from("0"));
  const [showPoints, setShowPoints] = useState(true);

  useEffect(() => {
    const updateCards = async () => {
      const cardsUpdate = [];
      for (let cardsIndex = 0; cardsIndex < numberCardsInPool; cardsIndex++) {
        try {
          const cardId = cardsInPool[cardsIndex].id;
          const cost = cardsInPool[cardsIndex].points;
          let tokenSupply = await readContracts.Collectible.tokenSupply(cardId);
          let tokenMaxSupply = await readContracts.Collectible.tokenMaxSupply(cardId);
          let available = tokenMaxSupply.sub(tokenSupply);

          let uri = await readContracts.Collectible.uri(0); //All tokens have the same base uri
          uri = uri.replace(/{(.*?)}/, cardId);
          const ipfsHash = uri.replace("https://ipfs.io/ipfs/", "");
          const jsonManifestBuffer = await getFromIPFS(ipfsHash);

          try {
            const jsonManifest =JSON.parse(jsonManifestBuffer.toString());
            cardsUpdate.push({ id: cardId.toNumber(), cost:cost, name: jsonManifest.name, available:available, description: jsonManifest.description, image:jsonManifest.image });
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
  }, [cardsInPool]);

  useEffect(() => {
    const fetchPoolData = async () => {
      setCollectionName(poolData ? poolData.title : "");
    };
    fetchPoolData();
  },[poolData]);

  useEffect(() => {
    const fetchStake = async () => {
      setCollectionName(poolData ? poolData.title : "");
      setMyStake(readContracts ? formatEther(await readContracts.Collections.balanceOf(address,collectionId)) : 0);
    };
    fetchStake();
  },[myStake,readContracts, yourLocalBalance]);

  useEffect(() => {
    const fetchPoints = async () => {
      try{
        setShowPoints(true);
        setMyPoints(await readContracts.Collections.getPoints(address,collectionId));
        setLastUpdate(await readContracts.Collections.getLastUpdate(address, collectionId));
        setRunCounter(true);
      }catch (e) {
        console.log(e);
      }

    };
    fetchPoints();
  },[yourLocalBalance]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setCounter(counter +1);
      if(poolData && runCounter){
        try{
          let reward = Math.floor((myStake * poolData.rewardRate * ((Math.floor(Date.now() / 1000)) - lastUpdate)))
          if(reward < 0) reward = 0;
          const calculatedEarned = BigNumber.from(reward.toString()).add(myPoints);
          setCalculatedAccruedPoints(calculatedEarned);
        }catch (e) {
          console.log(e);
        }
      }
        
    }, 1000);

    return () => {
      clearTimeout(timeout);
    };
  }, [counter]);


  let galleryList = []

  for(let i in cards){
    galleryList.push(
      <Badge.Ribbon 
      style={ 
        cards[i].available == 0 && {backgroundColor: '#ff0000'} ||
        cards[i].available >= 0 && {backgroundColor: '#f86'}
      } 
      text={
            cards[i].available >0 && ("Only " + cards[i].available + " left!") ||
            cards[i].available == 0 && ("Sold out :(")
            }>
        <Card
          key={cards[i].id}
          style={{ width: 300 }}
          cover={
            <img
              alt="example"
              src={cards[i].image}
            />
          }
          actions={[
            <h3>Cost: {formatEther(cards[i].cost)}</h3>,
            <RedeemButton
              itemId={cards[i].id}
              available={cards[i].available}
              cost={cards[i].cost}
            />
          ]}
        >
          <Meta
            title={cards[i].name}
            description={cards[i].description}
          />
        </Card>
        </Badge.Ribbon>
    )
  }

  // ---------------- Stake button ---------------------

  const [stake, setStake] = useState("loading...");

  function StakeButton(props){
    return(
      <Button
        onClick={() => {
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

  function UnstakeButton(props){
    return(
      <Button danger
        onClick={() => {
          tx(writeContracts.Collections.exit(collectionId));
        }}
      >
        Unstake all
      </Button>
    );
  }

  function ShowUnstakeButton(props) {
    if(myStake > 0)
      return <UnstakeButton />;
    else
      return(null);
  }

  // -------------------- Redeem button ------------------------

  function RedeemButton(props){
    if(calculatedAccruedPoints.gte(props.cost)){
      return(
        <Button type="primary" disabled={props.available == 0 ? true : false}
          onClick={() => {
            console.log(props.itemId);
            /* look how you call setPurpose on your contract: */
            tx(writeContracts.Collections.redeem(collectionId, props.itemId));
            setShowPoints(false);
          }}
        >
          {props.available > 0 && ("Redeem")}
          {props.available == 0 && ("Sold out")}
        </Button>
      );
    }else{
      return (<h3>Not enough points</h3>)
    }    
  }

  return (
    <div>
      <div style={{ width: 996, margin: "auto", marginTop: 32, paddingBottom: 32, marginBottom:32 }}>
      <h2>Cards in {collectionName}: {numberCardsInPool}</h2>

      <Row>
        <Col span={12}>
          <h2 >Staked: {myStake} tokens</h2>
        </Col>
        <Col span={12}>
          {(showPoints || true) && <h2>Points: {formatEther(calculatedAccruedPoints)} points</h2>}
        </Col>
      </Row>
  
      <div style={{ margin: 8 }}>
          <Input
            onChange={e => {
              setStake(e.target.value);
            }}
          />
          <ShowButton />
          <ShowUnstakeButton />
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
