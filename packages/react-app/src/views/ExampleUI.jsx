import { Button, Card, DatePicker, Divider, Input, Progress, Slider, Spin, Switch, Row, Col } from "antd";
import React, { useEffect, useState } from "react";
import { utils } from "ethers";
import { SyncOutlined } from "@ant-design/icons";

import { Address, Balance, Events } from "../components";
import CyberConnectFollowButton from "../components/CyberConnectFollowBtn";

import { getIdentity, getConnections, getFollowStatus } from "../queries";

export default function ExampleUI({
  purpose,
  address,
  mainnetProvider,
  localProvider,
  yourLocalBalance,
  price,
  tx,
  readContracts,
  writeContracts,
  injectedProvider,
}) {
  const [newPurpose, setNewPurpose] = useState("loading...");

  const demoAddr = "cyberlab.eth";
  const [identityInput, setIdentityInput] = useState(demoAddr);
  const [connectionsInput, setConnectionsInput] = useState(demoAddr);
  const [followInput, setFollowInput] = useState(demoAddr);
  const [followAddr, setFollowAddr] = useState("");

  const [identity, setIdentity] = useState(null);
  const [searchedIdentity, setSearchedIdentity] = useState(null);
  const [searchedConnections, setSearchedConnections] = useState(null);
  const [isFollowing, setIsFollowing] = useState(null);

  const fetchIdentity = async () => {
    if (!address) return;

    const res = await getIdentity({ address: address });
    if (res) {
      setIdentity(res);
    }
  };

  useEffect(() => {
    fetchIdentity();
  }, [address]);

  const searchIdentityHandler = async () => {
    if (!identityInput) return;
    const res = await getIdentity({ address: identityInput });
    if (res) {
      setSearchedIdentity(res);
    }
  };

  const searchConnectionsHandler = async () => {
    if (!connectionsInput) return;

    const res = await getConnections({ address: connectionsInput });
    if (res) {
      setSearchedConnections(res);
    }
  };

  const searchFollowHandler = async () => {
    if (!followInput) return;
    setFollowAddr(followInput);
    const res = await getFollowStatus({ fromAddr: address, toAddr: followInput });
    setIsFollowing(res);
  };

  const formatAddress = address => {
    const len = address.length;
    return address.substr(0, 5) + "..." + address.substring(len - 4, len);
  };

  return (
    <div>
      {/*
        ⚙️ Here is an example UI that displays and sets the purpose in your smart contract:
      */}
      <div style={{ border: "1px solid #cccccc", padding: 16, width: 500, margin: "auto", marginTop: 64 }}>
        {/* CyberConnect Profile Section */}
        <div>
          <h2>CyberConnect Example UI:</h2>
          <Divider />
          <div style={{ textAlign: "left", marginLeft: "10px" }}>
            <h3>Your profile (identity):</h3>
            {identity && (
              <div>
                <Row>
                  <Col span={6}>Twitter handle:</Col>
                  <Col span={18}>{identity.twitter?.handle ? identity.twitter.handle : "n/a"}</Col>
                </Row>
                <Row>
                  <Col span={6}>Address:</Col>
                  <Col span={18}>{identity.address}</Col>
                </Row>
                <Row>
                  <Col span={6}>Domain:</Col>
                  <Col span={18}>{identity.domain ? identity.domain : "n/a"}</Col>
                </Row>
                <Row>
                  <Col span={6}>Followers:</Col>
                  <Col span={18}>{identity.followerCount}</Col>
                </Row>
                <Row>
                  <Col span={6}>Following:</Col>
                  <Col span={18}>{identity.followingCount}</Col>
                </Row>
              </div>
            )}
          </div>
        </div>
        <Divider />
        <div style={{ textAlign: "left", marginLeft: "10px" }}>
          <h3>Search a profile:</h3>
          <Input
            placeholder="Enter the address/ens you want to search.."
            onChange={e => setIdentityInput(e.target.value)}
            value={identityInput}
          />
          <Button style={{ margin: "8px 0px" }} onClick={searchIdentityHandler}>
            Submit
          </Button>
          {searchedIdentity && (
            <div>
              <Row>
                <Col span={6}>Twitter handle:</Col>
                <Col span={18}>{searchedIdentity.twitter?.handle ? searchedIdentity.twitter.handle : "n/a"}</Col>
              </Row>
              <Row>
                <Col span={6}>Address:</Col>
                <Col span={18}>{searchedIdentity.address}</Col>
              </Row>
              <Row>
                <Col span={6}>Domain:</Col>
                <Col span={18}>{searchedIdentity.domain ? searchedIdentity.domain : "n/a"}</Col>
              </Row>
              <Row>
                <Col span={6}>Followers:</Col>
                <Col span={18}>{searchedIdentity.followerCount}</Col>
              </Row>
              <Row>
                <Col span={6}>Following:</Col>
                <Col span={18}>{searchedIdentity.followingCount}</Col>
              </Row>
            </div>
          )}
        </div>
        <Divider />
        <div style={{ textAlign: "left", marginLeft: "10px" }}>
          <h3>Search profile connections:</h3>
          <Input
            placeholder="Enter the address/ens you want to search.."
            onChange={e => setConnectionsInput(e.target.value)}
            value={connectionsInput}
          />
          <Button style={{ margin: "8px 0px" }} onClick={searchConnectionsHandler}>
            Submit
          </Button>
          {searchedConnections && (
            <div>
              <Row span={18} justify={"center"}>
                <div style={{ paddingRight: "20px" }}>
                  <h4>Followers</h4>
                  {searchedConnections &&
                    searchedConnections.followers?.list.map(user => {
                      return (
                        <div key={user.address}>
                          <div>{user.domain || formatAddress(user.address)}</div>
                        </div>
                      );
                    })}
                </div>
                <div style={{ paddingLeft: "20px" }}>
                  <h4>Followings</h4>
                  {searchedConnections &&
                    searchedConnections.followings?.list.map(user => {
                      return (
                        <div key={user.address}>
                          <div>{user.domain || formatAddress(user.address)}</div>
                        </div>
                      );
                    })}
                </div>
              </Row>
            </div>
          )}
        </div>
        <Divider />
        <div style={{ textAlign: "left", marginLeft: "10px" }}>
          <h3>Follow/Unfollow a profile:</h3>
          <Input
            placeholder="Enter the address/ens you want to follow/unfollow.."
            onChange={e => setFollowInput(e.target.value)}
            value={followInput}
          />
          <Button style={{ margin: "8px 0px" }} onClick={searchFollowHandler}>
            Submit
          </Button>
          <div>
            {followAddr && (
              <CyberConnectFollowButton
                isFollowing={isFollowing}
                targetAddress={followAddr}
                injectedProvider={injectedProvider}
                onSuccess={() => {
                  fetchIdentity();
                  searchIdentityHandler();
                  searchConnectionsHandler();
                  searchFollowHandler();
                }}
              />
            )}
          </div>
        </div>
        <Divider />
        <Divider />
        <h2>Scaffold-eth Example UI:</h2>
        <h4>purpose: {purpose}</h4>
        <Divider />
        <div style={{ margin: 8 }}>
          <Input
            onChange={e => {
              setNewPurpose(e.target.value);
            }}
          />
          <Button
            style={{ marginTop: 8 }}
            onClick={async () => {
              /* look how you call setPurpose on your contract: */
              /* notice how you pass a call back for tx updates too */
              const result = tx(writeContracts.YourContract.setPurpose(newPurpose), update => {
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
            Set Purpose!
          </Button>
        </div>
        <Divider />
        Your Address:
        <Address address={address} ensProvider={mainnetProvider} fontSize={16} />
        <Divider />
        ENS Address Example:
        <Address
          address="0x34aA3F359A9D614239015126635CE7732c18fDF3" /* this will show as austingriffith.eth */
          ensProvider={mainnetProvider}
          fontSize={16}
        />
        <Divider />
        {/* use utils.formatEther to display a BigNumber: */}
        <h2>Your Balance: {yourLocalBalance ? utils.formatEther(yourLocalBalance) : "..."}</h2>
        <div>OR</div>
        <Balance address={address} provider={localProvider} price={price} />
        <Divider />
        <div>🐳 Example Whale Balance:</div>
        <Balance balance={utils.parseEther("1000")} provider={localProvider} price={price} />
        <Divider />
        {/* use utils.formatEther to display a BigNumber: */}
        <h2>Your Balance: {yourLocalBalance ? utils.formatEther(yourLocalBalance) : "..."}</h2>
        <Divider />
        Your Contract Address:
        <Address
          address={readContracts && readContracts.YourContract ? readContracts.YourContract.address : null}
          ensProvider={mainnetProvider}
          fontSize={16}
        />
        <Divider />
        <div style={{ margin: 8 }}>
          <Button
            onClick={() => {
              /* look how you call setPurpose on your contract: */
              tx(writeContracts.YourContract.setPurpose("🍻 Cheers"));
            }}
          >
            Set Purpose to &quot;🍻 Cheers&quot;
          </Button>
        </div>
        <div style={{ margin: 8 }}>
          <Button
            onClick={() => {
              /*
              you can also just craft a transaction and send it to the tx() transactor
              here we are sending value straight to the contract's address:
            */
              tx({
                to: writeContracts.YourContract.address,
                value: utils.parseEther("0.001"),
              });
              /* this should throw an error about "no fallback nor receive function" until you add it */
            }}
          >
            Send Value
          </Button>
        </div>
        <div style={{ margin: 8 }}>
          <Button
            onClick={() => {
              /* look how we call setPurpose AND send some value along */
              tx(
                writeContracts.YourContract.setPurpose("💵 Paying for this one!", {
                  value: utils.parseEther("0.001"),
                }),
              );
              /* this will fail until you make the setPurpose function payable */
            }}
          >
            Set Purpose With Value
          </Button>
        </div>
        <div style={{ margin: 8 }}>
          <Button
            onClick={() => {
              /* you can also just craft a transaction and send it to the tx() transactor */
              tx({
                to: writeContracts.YourContract.address,
                value: utils.parseEther("0.001"),
                data: writeContracts.YourContract.interface.encodeFunctionData("setPurpose(string)", [
                  "🤓 Whoa so 1337!",
                ]),
              });
              /* this should throw an error about "no fallback nor receive function" until you add it */
            }}
          >
            Another Example
          </Button>
        </div>
      </div>

      {/*
        📑 Maybe display a list of events?
          (uncomment the event and emit line in YourContract.sol! )
      */}
      <Events
        contracts={readContracts}
        contractName="YourContract"
        eventName="SetPurpose"
        localProvider={localProvider}
        mainnetProvider={mainnetProvider}
        startBlock={1}
      />

      <div style={{ width: 600, margin: "auto", marginTop: 32, paddingBottom: 256 }}>
        <Card>
          Check out all the{" "}
          <a
            href="https://github.com/austintgriffith/scaffold-eth/tree/master/packages/react-app/src/components"
            target="_blank"
            rel="noopener noreferrer"
          >
            📦 components
          </a>
        </Card>

        <Card style={{ marginTop: 32 }}>
          <div>
            There are tons of generic components included from{" "}
            <a href="https://ant.design/components/overview/" target="_blank" rel="noopener noreferrer">
              🐜 ant.design
            </a>{" "}
            too!
          </div>

          <div style={{ marginTop: 8 }}>
            <Button type="primary">Buttons</Button>
          </div>

          <div style={{ marginTop: 8 }}>
            <SyncOutlined spin /> Icons
          </div>

          <div style={{ marginTop: 8 }}>
            Date Pickers?
            <div style={{ marginTop: 2 }}>
              <DatePicker onChange={() => {}} />
            </div>
          </div>

          <div style={{ marginTop: 32 }}>
            <Slider range defaultValue={[20, 50]} onChange={() => {}} />
          </div>

          <div style={{ marginTop: 32 }}>
            <Switch defaultChecked onChange={() => {}} />
          </div>

          <div style={{ marginTop: 32 }}>
            <Progress percent={50} status="active" />
          </div>

          <div style={{ marginTop: 32 }}>
            <Spin />
          </div>
        </Card>
      </div>
    </div>
  );
}
