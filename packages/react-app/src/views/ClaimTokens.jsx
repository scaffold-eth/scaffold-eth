import { Button, Select, Input, notification, ConfigProvider } from "antd";
import React, { useCallback, useEffect, useState } from "react";
import { Wallet, Contract, utils } from "zksync-web3";
import axios from "axios";
import externalContracts from "../contracts/external_contracts";

function ClaimTokens({ userSigner, address, updateBalanceBuidl }) {
  const [orderID, setOrderID] = useState();

  const handleClaim = async () => {
    const token = "5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8";

    try {
      const resultRegister = await axios.post(
        `https://staging.ethdenver2023.zksync.dev/v1/registrationEvent?token=${token}`,
        {
          name: "Test",
          lastName: "Damu",
          email: "damu@gmail.com",
          // enter any random id and hit this api (from browser or any api client) this address will get registered with order id
          orderID: orderID,
          walletAddress: "0x0fAb64624733a7020D332203568754EB1a37DB89",
          scanTimestamp: "2023-01-18T19:11:04.078Z",
          access: "granted",
          attempt: 0,
          previousAttemptTimestamp: "2023-01-18T17:51:30.344Z",
        },
      );

      console.log("register result: ", resultRegister);

      const messageToSign = "Please sign this message to validate you are the owner of your wallet";

      const signature = await userSigner.signMessage(messageToSign);
      console.log("signature: ", signature);

      try {
        const resultClaim = await axios.post(`https://staging.ethdenver2023.zksync.dev/v1/tickets/${orderID}/claim`, {
          publicAddress: address,
          signature: signature,
        });

        console.log("claim result: ", resultClaim);
        notification.success({
          message: "Tokens claimed!",
          description: `You claimed ${resultClaim.data.tokensToClaim} Buidl tokens.`,
          placement: "topRight",
        });
        await new Promise(r => setTimeout(r, 10000));
        updateBalanceBuidl();
      } catch (error) {
        if (error?.response) {
          console.log(`n-🔴 => error?.response?.data`, error?.response?.data);
          notification.error({
            message: "Error claiming tokens!",
            description: error?.response?.data?.message,
            placement: "topRight",
          });
        }
      }
    } catch (error) {
      if (error?.response) {
        console.log(`n-🔴 => error?.response?.data`, error?.response?.data);
        notification.error({
          message: "Error claiming tokens!",
          description: error?.response?.data?.message,
          placement: "topRight",
        });
      }
    }
  };

  return (
    <div style={{ width: 300, margin: "0 auto", marginBottom: 20 }}>
      <h2>Claim Buidl Tokens</h2>
      <Input
        value={orderID}
        onChange={e => {
          setOrderID(e.target.value);
        }}
        placeholder="OrderID"
      />
      <Button type="primary" onClick={handleClaim}>
        Claim
      </Button>
    </div>
  );
}

export default ClaimTokens;
