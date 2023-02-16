import { Button, Select, InputNumber, notification, ConfigProvider } from "antd";
import React, { useCallback, useEffect, useState } from "react";
import { Wallet, Contract, utils } from "zksync-web3";
import axios from "axios";
import externalContracts from "../contracts/external_contracts";

function ClaimTokens() {
  const handleRegister = async () => {
    const token = "5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8";

    try {
      const result = await axios.post(`https://staging.ethdenver2023.zksync.dev/v1/registrationEvent?token=${token}`, {
        name: "Naim",
        lastName: "Yo",
        email: "naim@gmail.com",
        // enter any random id and hit this api (from browser or any api client) this address will get registered with order id
        orderID: "1J3D9L4C88K82",
        walletAddress: "0x0fAb64624733a7020D332203568754EB1a37DB89",
        scanTimestamp: "2023-01-18T19:11:04.078Z",
        access: "granted",
        attempt: 0,
        previousAttemptTimestamp: "2023-01-18T17:51:30.344Z",
      });
      const data = result.data;

      console.log("register data: ", data);
    } catch (error) {
      if (error?.response) {
        console.log(`n-🔴 => error?.response?.data`, error?.response?.data);
      }
    }
  };

  return (
    <div>
      <h2>Claim Buidl Tokens</h2>
      <Button type="primary" onClick={handleRegister}>
        Register
      </Button>
    </div>
  );
}

export default ClaimTokens;
