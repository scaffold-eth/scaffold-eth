import React, { useEffect, useState } from "react";
import { Button, Card, List } from "antd";
import { Address } from "../components";
import { ethers } from "ethers";
import { useOnBlock, useContractReader } from "eth-hooks";

function YourNfts({
  DEBUG,
  readContracts,
  writeContracts,
  tx,
  mainnetProvider,
  blockExplorer,
  address,
  localProvider,
}) {
  const [nftBalance, setNftBalance] = useState(0);
  const [yourNftBalance, setYourNftBalance] = useState(0);
  const [yourNfts, setYourNfts] = useState([]);
  const [loadingNfts, setLoadingNfts] = useState(true);
  const [updateBalances, setUpdateBalances] = useState(0);
  const [readyToClaim, setReadyToClaim] = useState({});

  const priceToMint = useContractReader(readContracts, "MandalaMerge", "price");
  if (DEBUG) console.log("🤗 priceToMint:", priceToMint);

  const totalSupply = useContractReader(readContracts, "MandalaMerge", "totalSupply");
  if (DEBUG) console.log("🤗 totalSupply:", totalSupply);
  const mandalasLeft = 1111 - totalSupply;

  const futureBlocks = 10;

  useEffect(() => {
    const updateBalances = async () => {
      if (DEBUG) console.log("Updating balances...");
      if (readContracts.MandalaMerge) {
        const nftNewBalance = await readContracts.MandalaMerge.balanceOf(address);
        const yourNftNewBalance = nftNewBalance && nftNewBalance.toNumber && nftNewBalance.toNumber();
        if (DEBUG) console.log("NFT: Mandala - Balance: ", nftNewBalance);
        setNftBalance(nftNewBalance);
        setYourNftBalance(yourNftNewBalance);
      } else {
        if (DEBUG) console.log("Contracts not defined yet.");
      }
    };
    updateBalances();
  }, [address, readContracts.MandalaMerge, updateBalances]);

  useEffect(() => {
    const updateYourCollectibles = async () => {
      setLoadingNfts(true);
      const nftUpdate = [];
      let claims = {};
      for (let tokenIndex = 0; tokenIndex < yourNftBalance; tokenIndex++) {
        try {
          const tokenId = await readContracts.MandalaMerge.tokenOfOwnerByIndex(address, tokenIndex);
          if (DEBUG) console.log("Getting Mandala tokenId: ", tokenId);
          const claimed = await readContracts.MandalaMerge.claimed(tokenId);
          if (DEBUG) console.log("claimed: ", claimed);
          let nftObject = { id: tokenId, claimed: claimed, owner: address };
          if (!claimed) {
            const blockNumber = await readContracts.MandalaMerge.blockNumbers(tokenId);
            nftObject = { ...nftObject, blockNumber: blockNumber };
            let ready =
              ethers.BigNumber.from(localProvider._lastBlockNumber).gte(blockNumber.add(futureBlocks)) &&
              ethers.BigNumber.from(localProvider._lastBlockNumber).lt(blockNumber.add(futureBlocks + 256));
            let readyData = { ready: ready, missed: false };
            if (!ready) {
              readyData["blocks"] = blockNumber.add(futureBlocks).sub(ethers.BigNumber.from(localProvider._lastBlockNumber)).toString();
            }
            if (ethers.BigNumber.from(localProvider._lastBlockNumber).gte(blockNumber.add(futureBlocks + 256))) {
              readyData["missed"] = true;
            }
            claims[tokenId] = readyData;
          }
          if (claimed || (claims[tokenId] && claims[tokenId].missed)) {
            const tokenURI = await readContracts.MandalaMerge.tokenURI(tokenId);
            if (DEBUG) console.log("tokenURI: ", tokenURI);
            const jsonManifestString = atob(tokenURI.substring(29));

            try {
              const jsonManifest = JSON.parse(jsonManifestString);
              nftObject = { ...nftObject, uri: tokenURI, ...jsonManifest };
            } catch (e) {
              console.log(e);
            }
          }
          nftUpdate.push(nftObject);
        } catch (e) {
          console.log(e);
        }
      }
      if (DEBUG) console.log("nftUpdate: ", nftUpdate);
      setYourNfts(nftUpdate.reverse());
      if (DEBUG) console.log("claims: ", claims);
      setReadyToClaim(claims);
      setLoadingNfts(false);
    };
    updateYourCollectibles();
  }, [address, yourNftBalance, updateBalances]);

  const claim = async tokenId => {
    if (DEBUG) console.log("Claiming...");

    const blockNumberFromToken = await readContracts.MandalaMerge.blockNumbers(tokenId);
    if (DEBUG) console.log("blockNumberFromToken: ", blockNumberFromToken);

    const futureBlocks = await readContracts.MandalaMerge.futureBlocks();
    if (DEBUG) console.log("futureBlocks: ", futureBlocks);

    const futureBlockNumber = blockNumberFromToken.add(futureBlocks).toNumber();
    if (DEBUG) console.log("futureBlockNumber: ", futureBlockNumber);

    const blockData = await localProvider.send("eth_getBlockByNumber", [
      ethers.utils.hexValue(futureBlockNumber),
      true,
    ]);
    if (DEBUG) console.log("blockData: ", blockData);

    let values = [];
    values.push(blockData.parentHash);
    values.push(blockData.sha3Uncles);
    values.push(blockData.miner);
    values.push(blockData.stateRoot);
    values.push(blockData.transactionsRoot);
    values.push(blockData.receiptsRoot);
    values.push(blockData.logsBloom);
    values.push(blockData.difficulty);
    values.push(blockData.number);
    values.push(blockData.gasLimit);
    values.push(blockData.gasUsed);
    values.push(blockData.timestamp);
    values.push(blockData.extraData);
    values.push(blockData.mixHash);
    values.push(blockData.nonce);
    if ("baseFeePerGas" in blockData) {
      values.push(blockData.baseFeePerGas);
    }

    for (let i = 0; i < values.length; i++) {
      if (values[i] === "0x0") {
        values[i] = "0x";
      }
      if (values[i].length % 2) {
        values[i] = "0x0" + values[i].substring(2);
      }
    }

    if (DEBUG) console.log("blockData values: ", values);

    const rlpEncoded = ethers.utils.RLP.encode(values);
    if (DEBUG) console.log("blockData RLP: ", rlpEncoded);

    const blockHash = ethers.utils.keccak256(rlpEncoded);
    if (DEBUG) console.log("blockData hash: ", blockHash);

    try {
      const txCur = await tx(writeContracts.MandalaMerge.claim(tokenId, rlpEncoded, { gasLimit: 110000 }));
      await txCur.wait();
      setUpdateBalances(updateBalances + 1);
    } catch (e) {
      console.log("Failed to claim", e);
    }
  };

  useOnBlock(localProvider, () => {
    if (DEBUG) console.log(`Updating ready to claim: ${localProvider._lastBlockNumber}`);
    if (yourNfts.length > 0) {
      let claims = {};
      for (let i = 0; i < yourNfts.length; i++) {
        if (!yourNfts[i].claimed) {
          let blockNumber = yourNfts[i].blockNumber;
          if (DEBUG) console.log("blockNumber: ", blockNumber);
          let ready =
            ethers.BigNumber.from(localProvider._lastBlockNumber).gte(blockNumber.add(futureBlocks)) &&
            ethers.BigNumber.from(localProvider._lastBlockNumber).lt(blockNumber.add(futureBlocks + 256));
          let readyData = { ready: ready, missed: false };
          if (!ready) {
            readyData["blocks"] = blockNumber.add(futureBlocks).sub(ethers.BigNumber.from(localProvider._lastBlockNumber)).toString();
          }
          if (ethers.BigNumber.from(localProvider._lastBlockNumber).gte(blockNumber.add(futureBlocks + 256))) {
            readyData["missed"] = true;
          }
          claims[yourNfts[i].id] = readyData;
        }
      }
      if (DEBUG) console.log("claims: ", claims);
      setReadyToClaim(claims);
    }
  });

  return (
    <>
      <div style={{ maxWidth: 820, margin: "auto", marginTop: 32, paddingBottom: 12 }}>
        <div style={{ fontSize: 36 }}>
          <p>
            Only <strong>1,111 Mandala Merge</strong> available on a price curve <strong>increasing 0.0001 ETH</strong> with each new mint.
          </p>
          <p>50% from sales goes to fund builders at <a href="https://buidlguidl.com" target="_blank">BuidlGuidl</a>!</p>
        </div>
      </div>

      <div style={{ maxWidth: 820, margin: "auto", paddingBottom: 12 }}>
        <div style={{ fontSize: 30 }}>
          <p>
            Mint Steps:
            <ol style={{ textAlign: "left", fontSize: 20 }}>
              <li>Mint: you will create a new Mandala Merge NFT</li>
              <li>Claim: after minting, you have to wait 10 Ethereum blocks (about 2 minutes) and then you can claim your Mandala Merge NFT.
                <ul>
                  <li>This is to ensure you get an unpredictable random Mandala using the new feature <a href="https://eips.ethereum.org/EIPS/eip-4399" target="_blank">RANDAO</a> as randomness source (available post merge on Ethereum Proof of Stake).</li>
                  <li>This is the first NFT to use a fully on-chain unpredictable random generator.</li>
                  <li>You must claim your Mandala before the next 256 Ethereum blocks (about 50 minutes).</li>
                  <li>If you fail to claim your Mandala in this time window, your Mandala will not look finished.</li>
                </ul>
              </li>
            </ol>
          </p>
        </div>
      </div>

      <div style={{ maxWidth: 515, margin: "0 auto", paddingBottom: 0 }}>
        <Button
          className="mint-button"
          onClick={async () => {
            const priceRightNow = await readContracts.MandalaMerge.price();
            try {
              const txCur = await tx(writeContracts.MandalaMerge.mintItem({ value: priceRightNow, gasLimit: 250000 }));
              await txCur.wait();
              setUpdateBalances(updateBalances + 1);
            } catch (e) {
              console.log("mint failed", e);
            }
          }}
        >
          MINT for {priceToMint && (+ethers.utils.formatEther(priceToMint)).toFixed(4)} ETH
        </Button>
        <p style={{ fontWeight: "bold", fontSize: 24 }}>{mandalasLeft} left</p>
      </div>
      <div className="your-nfts">
        <List
          bordered
          loading={loadingNfts}
          dataSource={yourNfts}
          pagination={{ pageSize: 1 }}
          renderItem={item => {
            const id = item.id.toNumber();

            return (
              <List.Item key={"nft_" + id}>
                {item.claimed || (readyToClaim[id] && readyToClaim[id].missed) ? (
                  <Card
                    style={{ width: 1150 }}
                    title={
                      <div>
                        <span style={{ fontSize: 18, marginRight: 8 }}>{item.name}</span>
                      </div>
                    }
                  >
                    <img src={item.image} />
                  </Card>
                ) : (
                  <Card
                    style={{ width: 1150, height: 1150 }}
                    title={
                      <div>
                        <span style={{ fontSize: 18, marginRight: 8 }}>Mandala Merge #{id}</span>
                      </div>
                    }
                  >
                    <p style={{ marginTop: 450, fontSize: 24 }}>NFT not claimed yet</p>
                    <Button
                      className="claim"
                      onClick={async () => await claim(id)}
                      disabled={!readyToClaim[id] || !readyToClaim[id].ready}
                    >
                      Claim
                    </Button>
                    {readyToClaim[id] && readyToClaim[id].ready ? <p>Ready to Claim</p> : readyToClaim[id] && <p>Not ready to claim. You have to wait {readyToClaim[id].blocks} blocks</p>}
                  </Card>
                )}
              </List.Item>
            );
          }}
        />
      </div>
    </>
  );
}

export default YourNfts;
