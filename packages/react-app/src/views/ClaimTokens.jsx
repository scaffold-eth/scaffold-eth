import { Button, Input, notification, Progress } from "antd";
import React, { useState } from "react";
import axios from "axios";

function ClaimTokens({ userSigner, address, updateBalanceBuidl, apiUrl, localChainId }) {
  const [orderID, setOrderID] = useState(localStorage.getItem("orderID"));
  const [loading, setLoading] = useState(false);
  const [progressCount, setProgressCount] = useState(0);

  const handleClaim = async () => {
    const token = "5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8";

    window.plausible("ClaimClick");

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
          walletAddress: "0x0fAb64624733a7020D332203568754EB1a37DB89",
          scanTimestamp: "2023-01-18T19:11:04.078Z",
          access: "granted",
          attempt: 0,
          previousAttemptTimestamp: "2023-01-18T17:51:30.344Z",
        });

        console.log("register result: ", resultRegister);
      }

      // TODO: get message to sign from API
      const resultMessage = await axios.get(`${apiUrl}/v1/tickets/${orderID}/message`);
      setProgressCount(30);

      console.log("resultMessage: ", resultMessage);

      const messageToSign = resultMessage.data.messageToSign;

      const signature = await userSigner.signMessage(messageToSign);
      console.log("signature: ", signature);
      setProgressCount(50);

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
        await new Promise(r => setTimeout(r, 5000));
        setProgressCount(75);
        await new Promise(r => setTimeout(r, 5000));
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
    <div style={{ width: 550, margin: "0 auto", marginBottom: 20 }}>
      <h2 style={{ fontSize: 48 }}>
        Claim <img src="/assets/buidl.png" alt="Buidl" style={{ width: 160 }} /> Tokens
      </h2>
      <Input
        value={orderID}
        style={{
          width: 400,
          display: "block",
          margin: "0 auto",
          border: "2px solid black",
          borderRadius: 5,
        }}
        onChange={e => {
          setOrderID(e.target.value);
          localStorage.setItem("orderID", e.target.value);
        }}
        placeholder="OrderID"
      />
      <Button type="primary" className="claim-button" disabled={loading} onClick={handleClaim}>
        Claim
      </Button>
      {loading && (
        <div style={{ width: 400, margin: "0 auto" }}>
          <Progress percent={progressCount} status="active" />
        </div>
      )}
    </div>
  );
}

export default ClaimTokens;
