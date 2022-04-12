import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { Button, Card, List } from "antd";
import { CheckOutlined } from "@ant-design/icons";
import { AddressInput } from "../components";

function YourShips({
  DEBUG,
  readContracts,
  writeContracts,
  tx,
  mainnetProvider,
  blockExplorer,
  updateBalances,
  setUpdateBalances,
  address,
  selectedShip,
  setSelectedShip,
  shipCrew,
  setShipCrew,
  loogieCoinBalance,
}) {
  const [shipBalance, setShipBalance] = useState(0);
  const [yourShipBalance, setYourShipBalance] = useState(0);
  const [yourShips, setYourShips] = useState();
  const [transferToAddresses, setTransferToAddresses] = useState({});
  const [loadingShips, setLoadingShips] = useState(true);
  const history = useHistory();

  useEffect(() => {
    const updateBalances = async () => {
      if (DEBUG) console.log("Updating balances...");
      if (readContracts.LoogieShip) {
        const shipNewBalance = await readContracts.LoogieShip.balanceOf(address);
        if (DEBUG) console.log("NFT: LoogieShip - Balance: ", shipNewBalance);
        const yourShipNewBalance = shipNewBalance && shipNewBalance.toNumber && shipNewBalance.toNumber();
        setShipBalance(shipNewBalance);
        setYourShipBalance(yourShipNewBalance);
      } else {
        if (DEBUG) console.log("Contracts not defined yet.");
      }
    };
    updateBalances();
  }, [address, readContracts.LoogieShip, updateBalances]);

  useEffect(() => {
    const updateYourCollectibles = async () => {
      setLoadingShips(true);
      const shipUpdate = [];
      const shipCrewUpdate = [];
      for (let tokenIndex = 0; tokenIndex < yourShipBalance; tokenIndex++) {
        try {
          const tokenId = await readContracts.LoogieShip.tokenOfOwnerByIndex(address, tokenIndex);
          if (DEBUG) console.log("Getting LoogieShip tokenId: ", tokenId);
          const tokenURI = await readContracts.LoogieShip.tokenURI(tokenId);
          if (DEBUG) console.log("tokenURI: ", tokenURI);
          const jsonManifestString = atob(tokenURI.substring(29));

          try {
            const jsonManifest = JSON.parse(jsonManifestString);
            shipUpdate.push({ id: tokenId, uri: tokenURI, owner: address, ...jsonManifest });

            shipCrewUpdate[tokenId] = {};
            const captainId = await readContracts.LoogieShip.crewById(0, tokenId);
            shipCrewUpdate[tokenId]["Captain"] = captainId.toString();
            const engineerId = await readContracts.LoogieShip.crewById(1, tokenId);
            shipCrewUpdate[tokenId]["Chief Engineer"] = engineerId.toString();
            const officerId = await readContracts.LoogieShip.crewById(2, tokenId);
            shipCrewUpdate[tokenId]["Deck Officer"] = officerId.toString();
            const seamanId = await readContracts.LoogieShip.crewById(3, tokenId);
            shipCrewUpdate[tokenId]["Seaman"] = seamanId.toString();
            shipCrewUpdate[tokenId]["ready"] = captainId > 0 && engineerId > 0 && officerId > 0 && seamanId > 0;
          } catch (e) {
            console.log(e);
          }
        } catch (e) {
          console.log(e);
        }
      }
      setYourShips(shipUpdate.reverse());
      setShipCrew(shipCrewUpdate);
      setLoadingShips(false);
    };
    updateYourCollectibles();
  }, [address, yourShipBalance]);

  return (
    <>
      <div style={{ maxWidth: 820, margin: "auto", marginTop: 32, paddingBottom: 32 }}>
        <div style={{ fontSize: 16 }}>
          <p>
            {loogieCoinBalance ? loogieCoinBalance.toString() : "0"} <strong>LoogieCoins</strong>.
          </p>
          <p>
            Add the crew to your <strong>LoogieShip</strong>.
          </p>
        </div>
      </div>

      <div style={{ width: "auto", margin: "auto", paddingBottom: 25, minHeight: 800 }}>
        <div>
          <List
            grid={{
              gutter: 16,
              xs: 1,
              sm: 2,
              md: 2,
              lg: 3,
              xl: 4,
              xxl: 4,
            }}
            loading={loadingShips}
            dataSource={yourShips}
            renderItem={item => {
              const id = item.id.toNumber();

              return (
                <List.Item key={id + "_" + item.uri + "_" + item.owner}>
                  <Card
                    headStyle={{
                      backgroundColor: shipCrew && shipCrew[id] && shipCrew[id]["ready"] ? "#60f479" : "none",
                    }}
                    title={
                      <div>
                        <span style={{ fontSize: 18, marginRight: 8 }}>{item.name}</span>
                        <Button
                          className="action-inline-button"
                          onClick={() => {
                            setSelectedShip(id);
                            history.push("/addCrew");
                          }}
                        >
                          {shipCrew && shipCrew[id] && shipCrew[id]["ready"] ? "Go Fishing" : "Add Crew"}
                        </Button>
                        {shipCrew && shipCrew[id] && shipCrew[id]["ready"] && (
                          <CheckOutlined
                            title="Ready to go fishing!"
                            style={{
                              cursor: "pointer",
                              float: "right",
                              fontSize: 30,
                              fontWeight: "bold",
                              color: "green",
                            }}
                          />
                        )}
                      </div>
                    }
                  >
                    <img src={item.image} />
                    <div className="transfer">
                      <AddressInput
                        ensProvider={mainnetProvider}
                        placeholder="transfer to address"
                        value={transferToAddresses[id]}
                        onChange={newValue => {
                          const update = {};
                          update[id] = newValue;
                          setTransferToAddresses({ ...transferToAddresses, ...update });
                        }}
                      />
                      <Button
                        onClick={() => {
                          tx(writeContracts.LoogieShip.transferFrom(address, transferToAddresses[id], id), function (transaction) {
                            setUpdateBalances(updateBalances + 1);
                          });
                        }}
                      >
                        Transfer
                      </Button>
                    </div>
                  </Card>
                </List.Item>
              );
            }}
          />
        </div>
      </div>
    </>
  );
}

export default YourShips;
