import React, { useState } from "react";
import { useContractReader } from "eth-hooks";
import { ethers } from "ethers";
import { Button, Row, Col, Card, Checkbox, Divider, Input } from "antd";
import { TokenEvents, MarketplaceEvents } from "../components";

function Home({ yourLocalBalance, readContracts, address, writeContracts, tx, mainnetProvider, localProvider }) {
  const yourNFTTotal = useContractReader(readContracts, "v", "balanceOf", [address]);

  const yourERC20Bal = useContractReader(readContracts, "MockERC20", "balanceOf", [address]);

  //state
  const [nftURI, setNFTURI] = useState("");
  const [nftContractAddress, setNFTContractAddress] = useState("");
  const [listingTokenID, setListingTokenID] = useState();
  const [listingPrice, setListingPrice] = useState();
  const [auction, setAuction] = useState(false);
  const [payableCurrency, setPayableCurrency] = useState("");
  const [showTimeInput, setShowTimeInput] = useState("none");
  const [bidTime, setBidTime] = useState(0);
  const [nftToBuy, setNFTToBuy] = useState();
  const [nftToBid, setNFTToBid] = useState();
  const [bidAmount, setBidAmount] = useState();
  const [listingIDToWithdraw, setListingIDToWithdraw] = useState();
  const [royaltyAmount, setRoyaltyAmount] = useState();
  const [royaltyReceiver, setRoyaltyReceiver] = useState();

  function setAuctionBool() {
    if (auction == true) {
      setAuction(false);
    } else {
      setAuction(true);
    }

    if (showTimeInput == "none") {
      setShowTimeInput("block");
    } else {
      setShowTimeInput("none");
    }
  }

  return (
    <div>
      <div style={{ margin: "32px" }}>
        <span style={{ marginRight: 8 }}>🤖</span>
        Your ETH balance{" "}
        <span style={{ fontWeight: "bold", color: "green" }}>({ethers.utils.formatEther(yourLocalBalance)})</span>
      </div>

      <div style={{ margin: "32px" }}>
        <span style={{ marginRight: 8 }}>💵</span>
        Your MockERC20 balance <span style={{ fontWeight: "bold", color: "purple" }}>({parseInt(yourERC20Bal)})</span>
      </div>

      <Divider></Divider>

      <h2>🧑‍🎨 MockERC721/ NFT</h2>
      {yourNFTTotal ? (
        <div style={{ margin: "12px" }}>
          🖌️ Your NFT Balance:
          <span
            className="highlight"
            style={{
              marginLeft: 4,
              /* backgroundColor: "#f9f9f9", */ padding: 4,
              borderRadius: 4,
              fontWeight: "bolder",
            }}
          >
            {ethers.utils.formatUnits(yourNFTTotal, 0)}
          </span>
        </div>
      ) : (
        ""
      )}
      <h3>Create NFT:</h3>
      <div>
        <Input
          onChange={e => {
            setNFTURI(e.target.value);
          }}
          style={{ width: "300px" }}
          placeholder="enter token URI"
        />
        <Button
          onClick={async () => {
            const result = await tx(writeContracts.MockERC721.mintItem(nftURI), update => {
              console.log("📡 Transaction Update:", update);
              if (update && (update.status === "confirmed" || update.status === 1)) {
                console.log(" 🍾 Transaction " + update.hash + " finished!");
                console.log(
                  " ⛽️ " +
                    update.gasUsed +
                    "/" +
                    (update.gasLimit || update.gas) +
                    " @ " +
                    parseFloat(update.gasPrice) / 1000000000 +
                    " gwei",
                );
              }
            });
            console.log("awaiting metamask/web3 confirm result...", result);
            console.log(await result);
          }}
        >
          Mint
        </Button>
        <div>
          <TokenEvents
            contracts={readContracts}
            contractName="MockERC721"
            eventName="Transfer"
            localProvider={localProvider}
            mainnetProvider={mainnetProvider}
            startBlock={10118000}
          />
        </div>
      </div>

      <Divider></Divider>

      <h2>🏯 NFT Marketplace</h2>
      <p style={{ fontWeight: "lighter" }}>** You must use the approval pattern when using buy or bid functions. **</p>
      <p style={{ fontWeight: "lighter" }}>
        ** All listings are to be bought and bid on using the MockERC20 token provided NOT Ether **
      </p>

      <Row justify="center" align="middle">
        <Card style={{ marginRight: "18px" }}>
          <div>
            <h3>🦍 Create Listing</h3>
          </div>
          <div>
            <p>NFT</p>
            <div>
              <Input
                onChange={e => {
                  setNFTContractAddress(e.target.value);
                }}
                style={{ width: "275px" }}
                placeholder="NFT Contract Address"
              />
            </div>
            <div>
              <Input
                onChange={e => {
                  setListingTokenID(e.target.value);
                }}
                style={{ width: "200px" }}
                placeholder="Enter token ID to be listed"
              />
            </div>
            <p style={{ marginTop: "16px" }}>Payment Info</p>
            <div>
              <Input
                onChange={e => {
                  setListingPrice(e.target.value);
                }}
                style={{ width: "200px" }}
                placeholder="Enter listing starting price"
              />
            </div>
            <div>
              <Input
                onChange={e => {
                  setPayableCurrency(e.target.value);
                }}
                style={{ width: "275px" }}
                placeholder="Payable Currency (token address)"
              />
            </div>
            <p style={{ marginTop: "16px" }}>Structure</p>
            <div>
              <div>
                <Checkbox onChange={setAuctionBool}>Put on Auction?</Checkbox>
              </div>
              <div style={{ display: showTimeInput }}>
                <Input
                  onChange={e => {
                    setBidTime(e.target.value);
                  }}
                  style={{ width: "200px" }}
                  placeholder="Auction Time (seconds)"
                />
              </div>
            </div>

            <div style={{ marginTop: "26px" }}>
              <Button
                onClick={() => {
                  const result = tx(
                    writeContracts.MockERC721.approve(readContracts.Marketplace.address, listingTokenID),
                    update => {
                      console.log("📡 Transaction Update:", update);
                      if (update && (update.status === "confirmed" || update.status === 1)) {
                        console.log(" 🍾 Transaction " + update.hash + " finished!");
                        console.log(
                          " ⛽️ " +
                            update.gasUsed +
                            "/" +
                            (update.gasLimit || update.gas) +
                            " @ " +
                            parseFloat(update.gasPrice) / 1000000000 +
                            " gwei",
                        );
                      }
                    },
                  );
                }}
              >
                Approve
              </Button>
              <Button
                onClick={async () => {
                  let price = listingPrice;
                  console.log(listingTokenID, price, auction, bidTime);
                  let NFTAddress = nftContractAddress ? nftContractAddress : await readContracts.MockERC721.address;
                  let ERC20Address = payableCurrency ? payableCurrency : await readContracts.MockERC20.address;
                  const result = tx(
                    writeContracts.Marketplace.createListing(
                      NFTAddress,
                      listingTokenID,
                      price,
                      ERC20Address,
                      auction,
                      bidTime,
                    ),
                    update => {
                      console.log("📡 Transaction Update:", update);
                      if (update && (update.status === "confirmed" || update.status === 1)) {
                        console.log(" 🍾 Transaction " + update.hash + " finished!");
                        console.log(
                          " ⛽️ " +
                            update.gasUsed +
                            "/" +
                            (update.gasLimit || update.gas) +
                            " @ " +
                            parseFloat(update.gasPrice) / 1000000000 +
                            " gwei",
                        );
                      }
                    },
                  );
                  console.log("awaiting metamask/web3 confirm result...", result);
                  console.log(await result);
                }}
              >
                Create Listing
              </Button>
            </div>
          </div>
        </Card>

        <div>
          <Card style={{ width: "500px" }}>
            <h3>💸 Buy NFT:</h3>
            <div>
              <Input
                onChange={e => {
                  setNFTToBuy(e.target.value);
                }}
                style={{ width: "150px" }}
                placeholder="Enter Listing ID"
              />
              <Button
                onClick={async () => {
                  let nftPrice = await readContracts.Marketplace.getPrice(nftToBuy);
                  const result = await tx(
                    writeContracts.MockERC20.approve(await readContracts.Marketplace.address, nftPrice),
                    update => {
                      console.log("📡 Transaction Update:", update);
                      if (update && (update.status === "confirmed" || update.status === 1)) {
                        console.log(" 🍾 Transaction " + update.hash + " finished!");
                        console.log(
                          " ⛽️ " +
                            update.gasUsed +
                            "/" +
                            (update.gasLimit || update.gas) +
                            " @ " +
                            parseFloat(update.gasPrice) / 1000000000 +
                            " gwei",
                        );
                      }
                    },
                  );
                }}
              >
                Approve
              </Button>
              <Button
                onClick={async () => {
                  let nftCost = await readContracts.Marketplace.getPrice(nftToBuy);
                  console.log(nftCost);
                  const result = await tx(writeContracts.Marketplace.buy(nftToBuy, { value: nftCost }), update => {
                    console.log("📡 Transaction Update:", update);
                    if (update && (update.status === "confirmed" || update.status === 1)) {
                      console.log(" 🍾 Transaction " + update.hash + " finished!");
                      console.log(
                        " ⛽️ " +
                          update.gasUsed +
                          "/" +
                          (update.gasLimit || update.gas) +
                          " @ " +
                          parseFloat(update.gasPrice) / 1000000000 +
                          " gwei",
                      );
                    }
                  });
                  console.log("awaiting metamask/web3 confirm result...", await result);
                }}
              >
                Buy
              </Button>
            </div>
          </Card>
          <Card style={{ marginTop: "28px" }}>
            <div>
              <h3>🕔 Bid on NFT: </h3>
              <div>
                <Input
                  onChange={e => {
                    setNFTToBid(e.target.value);
                  }}
                  style={{ width: "125px" }}
                  placeholder="Enter Listing ID"
                />
                <Input
                  onChange={e => {
                    setBidAmount(e.target.value);
                  }}
                  style={{ width: "150px" }}
                  placeholder="Enter Bid amount"
                />
                <Button
                  onClick={async () => {
                    console.log(bidAmount);
                    let MarketplaceAddress = await readContracts.Marketplace.address;
                    const result = await tx(writeContracts.MockERC20.approve(MarketplaceAddress, bidAmount), update => {
                      console.log("📡 Transaction Update:", update);
                      if (update && (update.status === "confirmed" || update.status === 1)) {
                        console.log(" 🍾 Transaction " + update.hash + " finished!");
                        console.log(
                          " ⛽️ " +
                            update.gasUsed +
                            "/" +
                            (update.gasLimit || update.gas) +
                            " @ " +
                            parseFloat(update.gasPrice) / 1000000000 +
                            " gwei",
                        );
                      }
                    });
                    console.log("awaiting metamask/web3 confirm result...", result);
                    console.log(await result);
                  }}
                >
                  Approve
                </Button>
                <Button
                  onClick={async () => {
                    const result = await tx(writeContracts.Marketplace.bid(nftToBid, bidAmount), update => {
                      console.log("📡 Transaction Update:", update);
                      if (update && (update.status === "confirmed" || update.status === 1)) {
                        console.log(" 🍾 Transaction " + update.hash + " finished!");
                        console.log(
                          " ⛽️ " +
                            update.gasUsed +
                            "/" +
                            (update.gasLimit || update.gas) +
                            " @ " +
                            parseFloat(update.gasPrice) / 1000000000 +
                            " gwei",
                        );
                      }
                    });
                    console.log("awaiting metamask/web3 confirm result...", result);
                    console.log(await result);
                  }}
                >
                  Bid
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </Row>

      <Row>
        <MarketplaceEvents
          contracts={readContracts}
          contractName="Marketplace"
          eventName="ListingCreated"
          localProvider={localProvider}
          mainnetProvider={mainnetProvider}
          startBlock={10118000}
        />
      </Row>

      <Row justify="center" style={{ marginTop: "24px" }}>
        <Card>
          <h3>⏩ Withdraw</h3>
          <p style={{ fontWeight: "lighter" }}>
            Call after a auction has ended to claim proceeds as well as distribute royalty payment
          </p>
          <Input
            onChange={e => {
              setListingIDToWithdraw(e.target.value);
            }}
            style={{ width: "250px" }}
            placeholder="Listing ID to withdraw funds for"
          />
          <Button
            onClick={async () => {
              const result = await tx(writeContracts.Marketplace.withdraw(listingIDToWithdraw), update => {
                console.log("📡 Transaction Update:", update);
                if (update && (update.status === "confirmed" || update.status === 1)) {
                  console.log(" 🍾 Transaction " + update.hash + " finished!");
                  console.log(
                    " ⛽️ " +
                      update.gasUsed +
                      "/" +
                      (update.gasLimit || update.gas) +
                      " @ " +
                      parseFloat(update.gasPrice) / 1000000000 +
                      " gwei",
                  );
                }
              });
              console.log("awaiting metamask/web3 confirm result...", result);
              console.log(result);
            }}
          >
            Withdraw
          </Button>
        </Card>
      </Row>
      <Divider></Divider>
    </div>
  );
}

export default Home;
