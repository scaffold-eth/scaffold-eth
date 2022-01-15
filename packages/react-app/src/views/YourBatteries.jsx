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

  const priceToMint = useContractReader(readContracts, 'RobotoBattery', "price");
  if (DEBUG) console.log("🤗 priceToMint:", priceToMint);

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
      <div style={{ width: 515, marginTop: 32, paddingBottom: 32 }}>
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
        You have {yourBatteryBalance} batteries
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
          MINT Battery Pack for Ξ{priceToMint && (+ethers.utils.formatEther(priceToMint)).toFixed(4)}
        </Button>
      </div>
    </>
  );
}

export default YourBatteries;
