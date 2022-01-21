import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button, Card, List } from "antd";
import { Address, AddressInput } from "../components";
import { ethers } from "ethers";
import { useContractReader } from "eth-hooks";

function YourBatteries({
  DEBUG,
  readContracts,
  writeContracts,
  tx,
  address,
}) {
  const [batteryBalance, setBatteryBalance] = useState(0);
  const [yourBatteryBalance, setYourBatteryBalance] = useState(0);
  const [updateBatteryBalance, setUpdateBatteryBalance] = useState(0);
  const [batteryAllowance, setBatteryAllowance] = useState(0);
  const [priceToMint, setPriceToMint] = useState(0);

  useEffect(() => {
    const updatePrice = async () => {
      if (DEBUG) console.log("Updating price...");
      if (readContracts.Roboto) {
        const newPriceToMint = await readContracts.RobotoBattery.price();
        if (DEBUG) console.log("newPriceToMint: ", newPriceToMint);
        setPriceToMint(newPriceToMint);
      } else {
        if (DEBUG) console.log("Contracts not defined yet.");
      }
    };
    updatePrice();
  }, [address, readContracts.RobotoBattery]);

  useEffect(() => {
    const updateBalances = async () => {
      if (DEBUG) console.log("Updating balances...");
      const batteryNewBalance = await readContracts.RobotoBattery.balanceOf(address);
      const yourBatteryNewBalance = batteryNewBalance && batteryNewBalance.toNumber && batteryNewBalance.toNumber();
      if (DEBUG) console.log("Battery - Balance: ", batteryNewBalance, " - Your: ", yourBatteryNewBalance);
      const batteryNewAllowance = await readContracts.RobotoBattery.allowance(address, readContracts.Roboto.address);
      if (DEBUG) console.log("Allowance Battery: ", batteryNewAllowance);
      setBatteryBalance(batteryNewBalance);
      setYourBatteryBalance(yourBatteryNewBalance);
      setBatteryAllowance(batteryNewAllowance);
    };
    updateBalances();
  }, [address, readContracts, updateBatteryBalance]);

  return (
    <>
      <div style={{ textAlign: "right", marginTop: 0, paddingBottom: 0, marginRight: 50 }}>
        <Button
          type="primary"
          onClick={async () => {
            try {
              tx(writeContracts.RobotoBattery.mint({ value: priceToMint, gasLimit: 300000 }), function (transaction) {
                setUpdateBatteryBalance(updateBatteryBalance + 1);
              });
            } catch (e) {
              console.log("mint failed", e);
            }
          }}
        >
          MINT Battery Pack for {priceToMint && (+ethers.utils.formatEther(priceToMint)).toFixed(0)} MATIC
        </Button>
      </div>

      <div style={{ width: 515, marginTop: 32, paddingBottom: 32, margin: "0 auto" }}>
        {batteryAllowance < 10 && (
          <Button
            type="primary"
            onClick={async () => {
              try {
                tx(writeContracts.RobotoBattery.approve(readContracts.Roboto.address, 1000), function (transaction) {
                  setUpdateBatteryBalance(updateBatteryBalance + 1);
                });
              } catch (e) {
                console.log("mint failed", e);
              }
            }}
          >
            Enable Battery Recharge
          </Button>
        )}
        <div style={{ width: 300, margin: "0 auto" }}>
          <p style={{ fontSize: 20, fontWeight: "bold", marginBottom: 0 }}>You have {yourBatteryBalance} batteries</p>
          <img src="battery.svg" width="200" height="100" alt="Roboto Battery" />
        </div>
      </div>
    </>
  );
}

export default YourBatteries;
