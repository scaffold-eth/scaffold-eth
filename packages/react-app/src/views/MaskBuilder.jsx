/* eslint-disable jsx-a11y/accessible-emoji */

import React, { useState, useEffect } from "react";
import { Button, List, Divider, Input, Card, DatePicker, Slider, Switch, Progress, Spin } from "antd";
import { SyncOutlined } from '@ant-design/icons';
import { bn } from '@ethersproject/bignumber'
// Image manipulation
import mergeImages from 'merge-images';
import { addToIPFS, transactionHandler } from "../helpers"
import { PARTS } from '../partPicker';

const { BufferList } = require('bl')
const ipfsAPI = require('ipfs-http-client');
const Hash = require('ipfs-only-hash')
const ipfs = ipfsAPI({host: 'ipfs.infura.io', port: '5001', protocol: 'https' })
const ipfsConfig = {
    host: "127.0.0.1",
    port: "5001",
    protocol: "http",
    timeout: 2500
  };
//EXAMPLE STARTING JSON:
const STARTING_JSON_NFT = {
    "description": "Masks of Gods",
     "external_url": "",// <-- this can link to a page for the specific file too
     "image": "",
     "name": "",
     "attributes": [
        {
          "trait_type": "Gender",
          "value": "Male"
        },
        {
          "trait_type": "Race",
          "value": "Elf"
        }
     ]
 }

 

const MaskBuilder = ({ address, readContracts, writeContracts, vrfEvents, tx }) => {
    const [newImage, setNewImage] = useState();
    const [events, setEvents] = useState([]);

    const [background, setBackground] = useState(PARTS.BACKGROUND[0]);
    const [face, setFace] = useState(PARTS.FACE[0]);
    const [faceShadow, setFaceShadow] = useState(PARTS.FACE[10]);
    const [eyes, setEyes] = useState(PARTS.EYES[0]);
    const [mouth, setMouth] = useState(PARTS.MOUTH[0]);
    const [nose, setNose] = useState(PARTS.NOSE[0]);
    const [iris, setIris] = useState(PARTS.IRIS[0]);
    const [horns, setHorns] = useState(PARTS.HORNS[0]);
    const [bottom, setBottom] = useState(PARTS.MISC.BOTTOM[0]);
    const [top, setTop] = useState(PARTS.MISC.TOP[0])

    const [randomNumber, setRandomNumber] = useState(0);
    const [loadingMask, setLoadingMask] = useState(false);
    const [loadingParts, setLoadingParts] = useState(false);
    const [partsLoaded, setPartsLoaded] = useState(false);

    const [imageHash, setImageHash] = useState();
    const [imageUri, setImageUri] = useState();

    useEffect(() => {
        
    }, []);

    // get a random number from vrf to assemble mask
    const getMaskParts = async () => {        
        setLoadingParts(true);
        const sendTx = tx( writeContracts.RandomNumberConsumer.getRandomNumber(7777777) );
        setTimeout(() => {
            readContracts.RandomNumberConsumer.randomResult()
                .then((res) => {
                    // set all the parts
                    setRandomNumber(res);
                    //console.log(res.toString())  
                    setBackground(PARTS.BACKGROUND[res.toString().substring(16, 18) % 10])                  
                    //console.log(res.toString().substring(0, 2) % 8);                    
                    setFace(PARTS.FACE[res.toString().substring(0, 2) % 10]);
                    //console.log(res.toString().substring(2, 4) % 8);
                    setEyes(PARTS.EYES[res.toString().substring(2, 4) % 8]);
                    //console.log(res.toString().substring(4, 6) % 8);
                    setMouth(PARTS.MOUTH[res.toString().substring(4, 6) % 8]);
                    //console.log(res.toString().substring(6, 8) % 8)
                    setNose(PARTS.NOSE[res.toString().substring(6, 8) % 8]);
                    //console.log(res.toString().substring(8, 10) % 8);
                    setIris(PARTS.IRIS[res.toString().substring(8, 10) % 8]);
                    //console.log(res.toString().substring(10, 12) % 8);
                    
                    // todo: need to randomly set the horns
                    if((res.toString().substring(10, 12) % 8) < 4){
                        setHorns(PARTS.HORNS[res.toString().substring(10, 12) % 8]);
                    }
                    //console.log(res.toString().substring(12, 14) % 8);
                    setTop(PARTS.MISC.TOP[res.toString().substring(12, 14) % 8]);
                    //console.log(res.toString().substring(14, 16) % 8);
                    setBottom(PARTS.MISC.BOTTOM[res.toString().substring(14, 16) % 8]);
                });
                setLoadingParts(false);
                setPartsLoaded(true);
        }, 12000);
    }

    const makeMask = async () => { 
        setLoadingMask(true);      
        try {
            await mergeImages([
                { src: background },
                { src: face }, 
                { src: faceShadow },
                { src: eyes },
                { src: mouth },
                { src: nose },
                { src: iris },
                { src: horns },
                { src: bottom },
                { src: top }
            ],{
            }).then(b64 => {
                // console.log(b64);
                setNewImage(b64);
                // save image to ipfs and get the uri for minting token
                // let generatedMaskImage = document.getElementById("generated-mask-image");
                // let imgCanvas = document.getElementById("canvas");
                // let imgContext = imgCanvas.getContext("2d");

                // imgCanvas.width = generatedMaskImage.width;
                // imgCanvas.height = generatedMaskImage.height;
                // imgContext.drawImage(generatedMaskImage, 0, 0, generatedMaskImage.width, generatedMaskImage.height);

                //const imgDataAsUrl = imgCanvas.toDataURL("image/png");
                let imageBuffer = Buffer.from(b64.split(",")[1], 'base64');

                const imageResult = ipfs.add(imageBuffer)
                    .then((res) => {
                        STARTING_JSON_NFT.image = 'https://ipfs.io/ipfs/' + res.path;
                        STARTING_JSON_NFT.external_url = 'https://ipfs.io/ipfs/' + res.path;
                        STARTING_JSON_NFT.name = 'Mask'
                        setImageHash(res.path);
                        setImageUri('https://ipfs.io/ipfs/' + res.path);
                    });                   
                //https://ipfs.io/ipfs/QmVX2o5BGmhVXKApP4n8AyCMqYgPauThM5q9v7ycgRUZXP
            });            
              
        } catch (error) {
            console.log(error)
        }  
        setLoadingMask(false);
        setPartsLoaded(false);    
    }

    const mintNft = async () => {        
        //console.table(STARTING_JSON_NFT);
        console.log('Uploading your nft to ipfs...');
        const uploaded = await ipfs.add(JSON.stringify(STARTING_JSON_NFT));

        console.log(`Minting your nft with ipfs hash ${imageHash}`);
        console.log(uploaded.path);
        await writeContracts.YourCollectible.mintItem(address, uploaded.path, { gasLimit: 400000 });
    }

    //let counter = 0;

    return (
        <div>
            <Button loading={loadingParts} onClick={ () => getMaskParts() }>Get Parts</Button>
            <img id='generated-mask-image' src={newImage} style={{ maxWidth: 150 }}/>
            <Button loading={loadingMask} onClick={ () => makeMask() } disabled={!partsLoaded}>Make Mask</Button>
            <Divider />
            {imageHash} <br />
            {imageUri}           
            <Divider />
            <Button onClick={ () => { mintNft() } } disabled={partsLoaded}>Mint NFT</Button>
            <div style={{ width: 800, margin: "auto", marginTop: 32, paddingBottom: 32 }}>
            
            {/* <List
                bordered
                dataSource={vrfEvents}
                renderItem={(item) => {
                    return (
                    <List.Item key={ counter++ }>
                        { item.background + "_" + item.face + "_" + item.eyes + "_" + item.iris + "_" + item.nose + "_" + item.mouth + "_" + item.horns + "_" + item.misc }
                    </List.Item>
                    )
                }}
            /> */}
        </div>
        <Divider />
        </div>
    )
}

export default MaskBuilder;
