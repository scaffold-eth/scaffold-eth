import React, { useState } from "react";
import { useContractReader } from "eth-hooks";
import { ethers } from "ethers";
import { Button, Row, Col, Card, Checkbox, Divider, Input } from "antd";
import { TokenEvents, MarketplaceEvents } from "../components"


function Home({ yourLocalBalance, readContracts, address, writeContracts, tx, mainnetProvider, localProvider }) {

  const totalTokenSupply = useContractReader(readContracts, "YourToken", "totalSupply");

  const yourTokenSupply = useContractReader(readContracts, "YourToken", "balanceOf", [
    address
  ]);

  const yourNFTTotal = useContractReader(readContracts, "YourCollectible", "balanceOf", [address]);

  //state
  const [nftURI, setNFTURI] = useState("");
  const [listingTokenID, setListingTokenID] = useState();
  const [listingPrice, setListingPrice] = useState();
  const [acceptERC20, setAcceptERC20] = useState(false)
  const [auction, setAuction] = useState(false)
  const [showTimeInput, setShowTimeInput] = useState('none')
  const [bidTime, setBidTime] = useState(0)
  const [nftToBuy, setNFTToBuy] = useState();
  const [nftToBid, setNFTToBid] = useState();
  const [bidAmount, setBidAmount] = useState();
  const [listingIDToWithdraw, setListingIDToWithdraw] = useState();
  const [royaltyAmount, setRoyaltyAmount] = useState();
  const [royaltyReceiver, setRoyaltyReceiver] = useState();

  function setPaymentBool() {
    if (acceptERC20 == true) {
      setAcceptERC20(false)
    } else {
      setAcceptERC20(true)
    }
  }

  function setAuctionBool() {
    if (auction == true) {
      setAuction(false)
    } else {
      setAuction(true)
    }

    if (showTimeInput == 'none') {
      setShowTimeInput("block")
    } else {
      setShowTimeInput('none')
    }
  }

  return (
    <div>

      <div style={{ margin: 32 }}>
        <span style={{ marginRight: 8 }}>🤖</span>
        Your ETH balance{" "}
        <span style={{ fontWeight: "bold", color: "green" }}>({ethers.utils.formatEther(yourLocalBalance)})</span>
      </div>

      <Divider ></Divider>
      <h2 >Your ERC20</h2>
      {!totalTokenSupply ? <div>
        <span style={{ marginRight: 8 }}>👷‍♀️</span>
        You haven't deployed your contract yet, run
        <span
          className="highlight"
          style={{ marginLeft: 4, /* backgroundColor: "#f9f9f9", */ padding: 4, borderRadius: 4, fontWeight: "bolder" }}
        >
          yarn chain
        </span> and <span
          className="highlight"
          style={{ marginLeft: 4, /* backgroundColor: "#f9f9f9", */ padding: 4, borderRadius: 4, fontWeight: "bolder" }}
        >
          yarn deploy
        </span> to deploy your first contract!
      </div> : <div >
        <span style={{ marginRight: 8 }}>🤓</span>
        ERC20 Total token supply{" "}
        <span
          className="highlight"
          style={{ marginLeft: 4, /* backgroundColor: "#f9f9f9", */ padding: 4, borderRadius: 4, fontWeight: "bolder" }}
        >
          {ethers.utils.formatEther(totalTokenSupply)}
        </span> {" TOKENS"}
      </div>}
      <div >
        {
          yourTokenSupply ?
            <div >YourToken/ ERC20 Balance: <span
              className="highlight"
              style={{ marginLeft: 4, /* backgroundColor: "#f9f9f9", */ padding: 4, borderRadius: 4, fontWeight: "bolder" }}
            >{ethers.utils.formatEther(yourTokenSupply)}</span>{" TOKENS"}
            </div> : ""
        }
      </div>

      <Divider ></Divider>

      <h2 >YourCollectible/ NFT</h2>
      {
        yourNFTTotal ?
          <div style={{ margin: '12px' }}>🖌️ Your NFT Balance:
            <span
              className="highlight"
              style={{ marginLeft: 4, /* backgroundColor: "#f9f9f9", */ padding: 4, borderRadius: 4, fontWeight: "bolder" }}
            >{ethers.utils.formatUnits(yourNFTTotal, 0)}</span>
          </div> :
          ""
      }
      <h3 >🧑‍🎨 Create NFT:</h3>
      <div >
        <Input onChange={e => {
          setNFTURI(e.target.value);
        }}
          style={{ width: "300px" }}
          placeholder="enter token URI"
        />
        <Button
          onClick={async () => {
            const result = await tx(writeContracts.YourCollectible.safeMint(address, nftURI), update => {
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
          }}>
          Mint
        </Button>
        <div >
          <TokenEvents
            contracts={readContracts}
            contractName="YourCollectible"
            eventName="Transfer"
            localProvider={localProvider}
            mainnetProvider={mainnetProvider}
            startBlock={10118000}
          />
        </div>
      </div>

      <Divider ></Divider>

      <h2 >NFT Marketplace</h2>
      <p style={{ fontWeight: 'lighter' }}>** You must use the approval pattern when using buy or bid functions. **</p>
      <Row justify="center">
        <Card style={{ width: '500px' }}>
          <div >
            <h3 >🍨 List Your NFT on Marketplace:</h3>
          </div>
          <div >

            <Input onChange={e => {
              setListingTokenID(e.target.value);
            }}
              style={{ width: "200px" }}
              placeholder="Enter token ID to be listed"
            />
            <div >
              <Checkbox onChange={setPaymentBool}>Buy with ERC20?</Checkbox>
            </div>
            <div >
              <Input onChange={e => {
                setListingPrice(e.target.value);
              }}
                style={{ width: "200px" }}
                placeholder="Enter listing starting price"
              />
            </div >
            <div >
              <div >
                <Checkbox onChange={setAuctionBool}>Put on Auction?</Checkbox>
              </div>
              <div style={{ display: showTimeInput }}>
                <Input onChange={e => {
                  setBidTime(e.target.value);
                }}
                  style={{ width: "200px" }}
                  placeholder="Auction Time (seconds)"
                />
              </div>
              <Button onClick={() => {
                const result = tx(writeContracts.YourCollectible.approve(readContracts.Marketplace.address, listingTokenID), update => {
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
              }}>
                Approve
              </Button>
              <Button
                onClick={async () => {
                  let price = ethers.utils.parseUnits(listingPrice + '', 18)
                  console.log(listingTokenID, price, auction, acceptERC20, bidTime)
                  let NFTAddress = await readContracts.YourCollectible.address
                  const result = tx(writeContracts.Marketplace.createListing(NFTAddress, listingTokenID, price, auction, bidTime), update => {
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
                }}>
                Create Listing
              </Button>
            </div>
          </div>
        </Card>
        <div style={{ margin: '18px' }}>
          <Card style={{ width: '500px' }}>
            <h3 >💸 Buy NFT:</h3>
            <div >
              <Input onChange={e => {
                setNFTToBuy(e.target.value);
              }}
                style={{ width: "150px" }}
                placeholder="Enter Listing ID"
              />
              <Button
                onClick={async () => {
                  let nftPrice = await readContracts.Marketplace.getPrice(nftToBuy);
                  const result = await tx(writeContracts.YourToken.approve(await readContracts.Marketplace.address, nftPrice), update => {
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
                }}>
                Approve
              </Button>
              <Button
                onClick={async () => {
                  let nftCost = await readContracts.Marketplace.getPrice(nftToBuy);
                  console.log(nftCost); // [price, acceptERC20]
                  // If acceptERC20 == true, do not send tx with a value. Otherwise use payable function structure.
                  if (nftCost[1] == true) {
                    const result = await tx(writeContracts.Marketplace.buy(nftToBuy), update => {
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
                  } else {
                    const result = await tx(writeContracts.Marketplace.buy(nftToBuy, { value: nftCost[0] }), update => {
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
                  }
                }}>
                Buy
              </Button>
            </div>
          </Card>
          <Card style={{ width: '500px' }}>
            <div style={{ margin: '18px' }}>
              <h3 >🕔 Bid on NFT: </h3>
              <div >
                <Input onChange={e => {
                  setNFTToBid(e.target.value);
                }}
                  style={{ width: "125px" }}
                  placeholder="Enter Listing ID"
                />
                <Input onChange={e => {
                  setBidAmount(e.target.value);
                }}
                  style={{ width: "150px" }}
                  placeholder="Enter Bid amount"
                />
                <Button
                  onClick={async () => {
                    let bid = ethers.utils.parseUnits(bidAmount + '', 18)
                    console.log(bid)
                    const result = await tx(writeContracts.YourToken.approve(await readContracts.Marketplace.address, bid), update => {
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
                  }}>
                  Approve
                </Button>
                <Button
                  onClick={async () => {
                    let bid = ethers.utils.parseUnits(bidAmount + '', 18)
                    console.log(bid)
                    const listing = await readContracts.Marketplace.getPrice(nftToBid)
                    console.log(listing) // second value here tells whether in ERC20 or eth
                    // if true payment in emax, else ETH
                    if (listing[1] == true) {
                      const result = await tx(writeContracts.Marketplace.bid(nftToBid, bid), update => {
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
                    } else {
                      const result = await tx(writeContracts.Marketplace.bid(nftToBid, bid, { value: bid }), update => {
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
                    }

                  }}>
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
          eventName="listingCreated"
          localProvider={localProvider}
          mainnetProvider={mainnetProvider}
          startBlock={10118000}
        />
      </Row>

      <Row justify="center" style={{ marginTop: '24px' }}>
        <Card >
          <h3 >⏩ Withdraw After Auction has ended: </h3>
          <Input onChange={e => {
            setListingIDToWithdraw(e.target.value);
          }}
            style={{ width: "225px" }}
            placeholder="Listing ID to withdraw funds for"
          />
          <Button onClick={async () => {
            const result = await tx(writeContracts.Marketplace.withdrawAfterAuction(listingIDToWithdraw), update => {
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
