import React, { useState } from "react";
import { Button, notification } from "antd";
import axios from "axios";

/* This Home build uses the custom auth process
  - Signature, message and address is sent to the server for verification and custom JWT token
  - User can call /video route with JWT token attached to stream video
*/
const server = "http://localhost:49832";

function Home({ userSigner, web3Modal }) {
  const [isSigning, setIsSigning] = useState(false);
  const [token, setToken] = useState(null);

  const sendNotification = (type, data) => {
    return notification[type]({
      ...data,
      placement: "bottomRight",
    });
  };

  const handleSignIn = async () => {
    const message = "tokenValidation";

    if (web3Modal.cachedProvider == "") {
      return sendNotification("error", {
        message: "Failed to Sign In!",
        description: "Please Connect a wallet before Signing in",
      });
    }

    setIsSigning(true);

    try {
      // sign message using wallet
      const address = await userSigner.getAddress();
      let signature = await userSigner.signMessage(message);
      // send signature here for auth token
      const { data } = await axios.post(`${server}/signIn`, { signature, message, address });

      setToken(data.authToken);

      // notify user of sign-in
      sendNotification("success", {
        message: "Signed in successfully",
      });
    } catch (error) {
      sendNotification("error", {
        message: "Failed to Sign!",
        description: `Connection issue - ${error.message}`,
      });
    }

    setIsSigning(false);
  };

  return (
    <div>
      <Button loading={isSigning} style={{ marginTop: 32 }} type="primary" onClick={handleSignIn}>
        <span style={{ marginRight: 8 }}>🔏</span> sign a message with your ethereum wallet
      </Button>

      {token && (
        <div style={{ marginTop: 60 }}>
          <video width="400" height="400" controls>
            <source src={`${server}/video?token=${token}`} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      )}
    </div>
  );
}

export default Home;
