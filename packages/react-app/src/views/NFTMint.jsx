/* eslint-disable prettier/prettier */
import { Button, Divider, Input, Select, notification } from "antd";
import React, { useEffect, useState } from "react";
import { ethers, utils } from "ethers";
import ERC20Artifact from "@openzeppelin/contracts/build/contracts/IERC20.json";
import { Address, ERC20Balance, Transactions } from "../components";
import { BASE_URL, bbSupportedERC20Tokens, bbNode, AI_API_KEY } from "../constants";
import styles from "../NFTmint.css";
import axios from "axios";
import { saveAs } from "file-saver";
// eslint-disable-next-line no-unused-vars
import { uploadFileToIPFS, uploadJSONToIPFS } from "../components/Pinata";
import { NFT_STORAGE_API_KEY } from "../constants";
import { ImagePreview } from "graphiql/dist/components/ImagePreview";
export default function NFTMint({
  purpose,
  address,
  mainnetProvider,
  localProvider,
  yourLocalBalance,
  price,
  tx,
  readContracts,
  writeContracts,
}) {
  const [fromToken, setFromToken] = useState();
  const [toToken, setToToken] = useState();
  const [value, setValue] = useState("");
  const [isTokenApproved, setIsTokenApproved] = useState(false);
  const isBuildbearNet = localProvider && localProvider.connection.url.startsWith(`https://rpc.${BASE_URL}`);
  const erc20ABI = ERC20Artifact.abi;
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [img, setImg] = useState("");
  const [ipfs, setIpfs] = useState("");
  const [promt, setPromt] = useState("");
  const [imgurl, setImgurl] = useState("");
  const [NFTlist, setNFTlist] = useState([]);
  const [nftdatalist, setNftdatalist] = useState([]);

  const upload = async () => {
    try {
      const img1 = await uploadFileToIPFS(img);
      const nft = {
        image: img1.pinataURL,
        name: name,
        description: description,
      };
      console.log("Uploaded Image to Pinata: ", img1);
      const response = await uploadJSONToIPFS(nft);
      // response.then((res) => {
      //     console.log("Uploaded JSON to Pinata: ", res);
      //     setIpfs(res.pinataURL);
      // });

      if (response.success === true) {
        console.log("Uploaded JSON to Pinata: ", response);
        setIpfs(response.pinataURL);
      }
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      console.log(ipfs);
      let trx = await writeContracts.NFT.mint(signer.getAddress(), response.pinataURL);
      await trx.wait();
      let tt = await provider.getTransactionReceipt(trx.hash);
      console.log(tt);
      if (tt.status === 1) {
        notification.open({
          message: "Mint complete 🦄",
        });
        console.log("success");
        fetchnft();
      } else {
        alert("fail");
        console.log("fail");
      }
    } catch (err) {
      console.log(err);
    }
  };
  const uploadimg = event => {
    setImg(event.target.files[0]);
    var image = document.getElementById("output");
    image.src = URL.createObjectURL(event.target.files[0]);
  };
  const fetchnft = async () => {
    try {
      if (writeContracts) {
        console.log("inside loop 1");

        const provider = new ethers.providers.Web3Provider(window.ethereum);
        let trx = await writeContracts.NFT.balanceOf(provider.getSigner().getAddress());
        console.log("inside loop 2", trx.toNumber());
        var nfturilist = [];
        for (let i = 1; i <= trx.toNumber(); i++) {
          let tt = await readContracts.NFT.tokenURI(i);
          let uri1 = tt.replace("https://gateway.pinata.cloud/ipfs/", "https://ipfs.io/ipfs/");
          nfturilist.push(uri1);
          console.log("inside loop");
        }
        setNFTlist(nfturilist);
        const nftdata = [];
        for (let i = 0; i < nfturilist.length; i++) {
          console.log("uri", nfturilist[i]);
          let meta = await axios.get(nfturilist[i]);
          const obj = {
            name: meta.data.name,
            description: meta.data.description,
            image: meta.data.image,
          };
          nftdata.push(obj);
        }
        setNftdatalist(nftdata);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    (async function() {
      if (writeContracts) {
        fetchnft();
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [writeContracts]);

  return (
    <div style={{ paddingBottom: 256 }}>
      <div
        style={{
          border: "1px solid #cccccc",
          padding: 16,
          width: 700,
          margin: "auto",
          marginTop: 64,
          paddingBottom: 30,
        }}
      >
        <main className={styles.main}>
          <h1 className={styles.title}>
            Mint <a>NFTs</a>
          </h1>
          <Divider />
          <p className={styles.description}></p>
          <img id="output" width="500" />
          <br />
          <div className={styles.form}>
            <div className={styles.firstrow}>
              <Input
                type="text"
                width={100}
                value={name}
                placeholder="Name of the NFT"
                onChange={e => setName(e.target.value)}
              ></Input>
            </div>
            <br />
            <div className={styles.secondrow}>
              <Input
                type="text"
                value={description}
                placeholder="Description for the NFT"
                onChange={e => setDescription(e.target.value)}
              ></Input>
            </div>
            <br />
            <div className={styles.thirdrow}></div>
            <label className={styles.inputLabel}>
              <Input type="file" onChange={e => uploadimg(e)}></Input>
            </label>
            <div className={styles.buttonRow}>
              <Button onClick={upload}>Mint</Button>
            </div>
            <div className={styles.secondrow}></div>
          </div>
        </main>
        <Divider />
        <h3 style={{ margin: 8 }}>How NFT minting works?</h3>
        <div style={{ margin: 8 }}>
          The NFT metadata is first uploaded to
          <span className="highlight" style={{ marginLeft: 4, padding: 4, borderRadius: 4, fontWeight: "bolder" }}>
            IPFS
          </span>{" "}
          Network. Then by using the
          <span className="highlight" style={{ marginLeft: 4, padding: 4, borderRadius: 4, fontWeight: "bolder" }}>
            mint()
          </span>{" "}
          function defined in the
          <span className="highlight" style={{ marginLeft: 4, padding: 4, borderRadius: 4, fontWeight: "bolder" }}>
            NFT.sol
          </span>{" "}
          NFTs are minted by passing content identifier(also known as a CID).
        </div>
        <Divider />
        Your NFTs
        {nftdatalist.map((item, index) => {
          return (
            <div key={index}>
              <div style={{ margin: 8 }}>
                <h3 style={{ margin: 8 }}>NFT #{index + 1}</h3>
                <h5 style={{ margin: 8 }}>Name: {nftdatalist[index].name}</h5>
                <p style={{ margin: 8 }}>Description: {item.description}</p>
                <img src={item.image} width="200" />
              </div>
            </div>
          );
        })}
        <Divider />
        NFT Contract Address:
        <Address
          address={readContracts && readContracts.NFT ? readContracts.NFT.address : null}
          ensProvider={mainnetProvider}
          blockExplorer={isBuildbearNet ? `https://explorer.${BASE_URL}/${bbNode.nodeId}/` : undefined}
          fontSize={16}
        />
      </div>
      {isBuildbearNet ? <Transactions /> : null}
    </div>
  );
}
