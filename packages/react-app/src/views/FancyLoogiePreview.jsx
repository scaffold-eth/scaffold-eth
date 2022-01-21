import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Alert, Button, Card, Col, Input, List, Menu, Row, Tabs, Dropdown, Badge } from "antd";
import { DownOutlined } from "@ant-design/icons";
import { Address, AddressInput } from "../components";
import { ethers } from "ethers";
const { TabPane } = Tabs;
import { useContractReader } from "eth-hooks";

function FancyLoogiePreview({
  DEBUG,
  readContracts,
  writeContracts,
  tx,
  address,
  updateBalances,
  setUpdateBalances,
  nfts,
  nftsSvg,
  fancyLoogiesNfts,
  selectedFancyLoogie,
  selectedFancyLoogiePreview,
  setSelectedFancyLoogiePreview,
  selectedNfts,
  setSelectedNfts,
  setFancyLoogiesNfts,
  fancyLoogiePreviewActiveTab,
  setFancyLoogiePreviewActiveTab,
}) {
  useEffect(() => {
    const updatePreview = async () => {
      if (DEBUG) console.log("Updating preview...");
      if (selectedFancyLoogie) {
        let nftUpdate = {};
        const loogieSvg = await readContracts.Roboto.renderTokenById(selectedFancyLoogie);
        let nftsSvg = "";
        let antennasSvg = "";
        for (const nft of nfts) {
          if (selectedNfts[nft] && nft != "Antennas") {
            nftsSvg += await readContracts[nft].renderTokenById(selectedNfts[nft]);
          }
          if (selectedNfts["Antennas"]) {
            antennasSvg += await readContracts["Antennas"].renderTokenById(selectedNfts["Antennas"]);
          }
          const svg =
            '<svg width="300" height="300" transform="translate(50, 50) scale(1.5 1.5)" xmlns="http://www.w3.org/2000/svg">' + antennasSvg + loogieSvg + nftsSvg + "</svg>";
          setSelectedFancyLoogiePreview(svg);
        }
      } else {
        setSelectedFancyLoogiePreview("");
      }
    };
    updatePreview();
  }, [address, selectedFancyLoogie, selectedNfts, updateBalances]);

  const batteryStatus = useContractReader(readContracts, "Roboto", "batteryStatus", [selectedFancyLoogie]);

  return (
    <>
      {selectedFancyLoogiePreview ? (
        <div class="fancy-loogie-preview">
          <Card
            style={{ width: 700 }}
            bordered={false}
          >
            <div dangerouslySetInnerHTML={{ __html: selectedFancyLoogiePreview }}></div>
            <Alert message={
              <List size="large" header={<div style={{ fontWeight: "bold", textAlign: "center", fontSize: 16 }}>Selected Roboto #{selectedFancyLoogie}</div>}>
                {nfts.map(function (nft) {
                  return (
                    <List.Item key={nft}>
                      { fancyLoogiesNfts &&
                        fancyLoogiesNfts[selectedFancyLoogie] &&
                        fancyLoogiesNfts[selectedFancyLoogie][readContracts[nft].address] > 0 ? (
                          <div>
                            Wearing {nft} #{fancyLoogiesNfts[selectedFancyLoogie][readContracts[nft].address]}
                            <Button
                              className="action-inline-button"
                              onClick={() => {
                                tx(writeContracts.Roboto.removeNftFromLoogie(readContracts[nft].address, selectedFancyLoogie), function (transaction) {
                                  setFancyLoogiesNfts(prevState => ({
                                    ...prevState,
                                    [selectedFancyLoogie]: {
                                      ...prevState[selectedFancyLoogie],
                                      [readContracts[nft].address]: 0
                                    }
                                  }));
                                  setUpdateBalances(updateBalances + 1);
                                });
                              }}
                            >
                              Remove
                            </Button>
                          </div>
                        ) : (
                          <div>
                            {selectedNfts[nft] ? (
                              <div>
                                <span>Previewing {nft} #{selectedNfts[nft]}</span>
                                { fancyLoogiesNfts &&
                                  fancyLoogiesNfts[selectedFancyLoogie] &&
                                  fancyLoogiesNfts[selectedFancyLoogie][readContracts[nft].address] == 0 && (
                                  <Button
                                    type="primary"
                                    className="action-inline-button"
                                    onClick={() => {
                                      const tankIdInBytes =
                                        "0x" + parseInt(selectedFancyLoogie).toString(16).padStart(64, "0");

                                      tx(
                                        writeContracts[nft]["safeTransferFrom(address,address,uint256,bytes)"](
                                          address,
                                          readContracts.Roboto.address,
                                          selectedNfts[nft],
                                          tankIdInBytes,
                                        ),
                                        function (transaction) {
                                          setSelectedNfts(prevState => ({
                                            ...prevState,
                                            [nft]: null,
                                          }));
                                          setFancyLoogiesNfts(prevState => ({
                                            ...prevState,
                                            [selectedFancyLoogie]: {
                                              ...prevState[selectedFancyLoogie],
                                              [readContracts[nft].address]: selectedNfts[nft]
                                            }
                                          }));
                                          setUpdateBalances(updateBalances + 1);
                                        },
                                      );
                                    }}
                                  >
                                    Transfer
                                  </Button>
                                )}
                              </div>
                            ) : (
                              <span>Select a {nft} to preview</span>
                            )}
                          </div>
                        )
                      }
                    </List.Item>
                  )
                })}
                <List.Item key="battery">
                  Battery Charge: {(batteryStatus / 1000).toFixed(2)}%
                  <Button
                    type="primary"
                    className="action-inline-button"
                    onClick={async () => {
                      try {
                        tx(writeContracts.Roboto.recharge(selectedFancyLoogie), function (transaction) {
                          setUpdateBalances(updateBalances + 1);
                        });
                      } catch (e) {
                        console.log("recharge failed", e);
                      }
                    }}
                  >
                    { "Recharge" }
                  </Button>
                </List.Item>
              </List>
            } type="info" />
          </Card>
        </div>
      ) : (
        <div class="fancy-loogie-preview">
          <Card
            style={{ width: 515 }}
            title={
              <div style={{ height: 45 }}>
                <span style={{ fontSize: 18, marginRight: 8 }}>No Roboto selected</span>
              </div>
            }
          />
        </div>
      )}
    </>
  );
}

export default FancyLoogiePreview;
