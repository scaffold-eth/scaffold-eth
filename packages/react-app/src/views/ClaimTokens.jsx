import { Button, Input, notification, Spin, Progress } from "antd";
import React, { useState } from "react";

import axios from "axios";

function ClaimTokens({ userSigner, address, updateBalanceBuidl, apiUrl, localChainId }) {
  const [orderID, setOrderID] = useState();
  const [loading, setLoading] = useState(false);
  const [progressCount, setProgressCount] = useState(0);

  const handleClaim = async () => {
    const token = "5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8";

    try {
      setProgressCount(10);
      setLoading(true);

      // do not register orderID on prod
      if (localChainId !== 324) {
        const resultRegister = await axios.post(`${apiUrl}/v1/registrationEvent?token=${token}`, {
          name: "Test",
          lastName: "Damu",
          email: "damu@gmail.com",
          // enter any random id and hit this api (from browser or any api client) this address will get registered with order id
          orderID: orderID,
          walletAddress: "0xA4ca1b15fE81F57cb2d3f686c7B13309906cd37B",
          scanTimestamp: "2023-01-18T19:11:04.078Z",
          access: "granted",
          attempt: 0,
          previousAttemptTimestamp: "2023-01-18T17:51:30.344Z",
        });

        console.log("register result: ", resultRegister);
      }
      setProgressCount(40);
      // TODO: get message to sign from API
      const resultMessage = await axios.get(`${apiUrl}/v1/tickets/${orderID}/message`);

      console.log("resultMessage: ", resultMessage);

      const messageToSign = resultMessage.data.messageToSign;

      const signature = await userSigner.signMessage(messageToSign);
      console.log("signature: ", signature);
      setProgressCount(70);

      try {
        const resultClaim = await axios.post(`${apiUrl}/v1/tickets/${orderID}/claim`, {
          publicAddress: address,
          signature: signature,
        });

        console.log("claim result: ", resultClaim);
        notification.success({
          message: "Tokens claimed!",
          description: `You claimed ${resultClaim.data.tokensToClaim} Buidl tokens.`,
          placement: "topRight",
        });
        window.plausible("Claimed", { props: { orderID: orderID } });
        await new Promise(r => setTimeout(r, 10000));
        setProgressCount(100);
        updateBalanceBuidl();
        setLoading(false);
      } catch (error) {
        if (error?.response) {
          console.log(`n-🔴 => error?.response?.data`, error?.response?.data);
          notification.error({
            message: "Error claiming tokens!",
            description: error?.response?.data?.message,
            placement: "topRight",
          });
        }
        window.plausible("ClaimError", { props: { message: error?.response?.data?.message } });
        setLoading(false);
      }
    } catch (error) {
      if (error?.response) {
        console.log(`n-🔴 => error?.response?.data`, error?.response?.data);
        notification.error({
          message: "Error claiming tokens!",
          description: error?.response?.data?.message,
          placement: "topRight",
        });
        window.plausible("ClaimError", { props: { message: error?.response?.data?.message } });
      }
      setLoading(false);
    }
  };

  return (
    <div
      className="flex flex-col gap-3 max-w-[400px] my-0 mx-auto
   "
    >
      <h2 className="font-mono font-bold">Claim Buidl Tokens</h2>

      <Input
        value={orderID}
        onChange={e => {
          setOrderID(e.target.value);
        }}
        placeholder="OrderID"
      />

      <Button type="primary" className=" plausible-event-name=ClaimClick" disabled={loading} onClick={handleClaim}>
        Claim
      </Button>
      {loading && <Progress percent={progressCount} status="active" />}
    </div>
  );
}

export default ClaimTokens;
