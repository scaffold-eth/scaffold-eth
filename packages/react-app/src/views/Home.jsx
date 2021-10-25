import React, { useState } from "react";
import { Button, notification } from "antd";
import axios from "axios";
import arm from '../assets/g35.png'
import playFilmImg from '../assets/earth.png'

/* This Home build uses the custom auth process
  - Signature, message and address is sent to the server for verification and custom JWT token
  - User can call /video route with JWT token attached to stream video
*/
const server = "http://localhost:49832";

function Home({ userSigner, web3Modal, loadWeb3Modal }) {
  const [isSigning, setIsSigning] = useState(false);
  const [token, setToken] = useState(null);

  const sendNotification = (type, data) => {
    return notification[type]({
      ...data,
      placement: "bottomRight",
    });
  };

  const handleSignIn = async () => {

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
      const message = `I am ${address} and I would like to watch the film 
  “We Are as Gods” from Structure Films. I am presenting my token for validation, the token will 
  remain in my wallet`;
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

  const phases = [];
  if (web3Modal) {
    if (!web3Modal.cachedProvider) {
      phases.push(
        <div>
          <h2 className="instruction">
            1. To watch the film, <br />
            first link your wallet.
          </h2>
          <Button
            key="loginbutton"
            onClick={loadWeb3Modal}
          >
            connect wallet
          </Button>
          <h2 className="instruction">(You will have to present a token once your wallet is linked.)</h2>
        </div>
        ,
      );
    } else if (web3Modal.cachedProvider && !token) {
      phases.push(
        <div>
          <h2 className="instruction">
            2. Thanks for linking your wallet. Next, sign<br />
            a message presenting your token.
          </h2>
          <Button loading={isSigning}
            onClick={handleSignIn}>
            sign message
          </Button>
        </div>
        ,
      );
    } else if (web3Modal.cachedProvider && token) {
      phases.push(
        <div>
          <h2 className="instruction earth-small">
            3. Click to play the film. Enjoy!
          </h2>
          <img className="play-film" src={playFilmImg} alt="click to play the film" />
        </div>
      );
    }
  }

  return (
    <div className="home">
      <img className="arm" src={arm} alt="arm and hand pointing to button" />

      {phases}

    </div>
  );
}

export default Home;
