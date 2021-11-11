import React, { useState } from "react";
import { Button, notification, Modal } from "antd";
import axios from "axios";
import jwtDecode from "jwt-decode";
import Vimeo from "@u-wave/react-vimeo";
import arm from "../assets/g35.png";
import playFilmImg from "../assets/earth.png";
import { X } from "react-feather";

/* This Home build uses the custom auth process
  - Signature, message and address is sent to the server for verification and custom JWT token
  - User can call /video route with JWT token attached to stream video
*/
const server = "https://scaffold-gated-backend.herokuapp.com";

function Home({ userSigner, web3Modal, loadWeb3Modal }) {
  const [isSigning, setIsSigning] = useState(false);
  const [token, setToken] = useState(null);
  const [video, setVideo] = useState(null);
  const [play, setPlay] = useState(false);

  const closeIcon = <X size={30} />;

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

      // decode JWT token
      const decodedToken = jwtDecode(data.authToken);

      console.log(decodedToken);

      if (decodedToken.address.toLowerCase() !== address.toLowerCase()) {
        throw new Error("Invalid connected address and signer match");
      }

      setVideo(decodedToken.video);
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
          <Button key="loginbutton" onClick={loadWeb3Modal}>
            connect wallet
          </Button>
          <h2 className="instruction">(You will have to present a token once your wallet is linked.)</h2>
        </div>,
      );
    } else if (web3Modal.cachedProvider && !token) {
      phases.push(
        <div>
          <h2 className="instruction">
            2. Thanks for linking your wallet. Next, sign
            <br />a message presenting your token.
          </h2>
          <Button loading={isSigning} onClick={handleSignIn}>
            sign message
          </Button>
        </div>,
      );
    } else if (web3Modal.cachedProvider && token) {
      phases.push(
        <div style={{ marginTop: 30, marginBottom: "10rem" }}>
          <h2 className="instruction earth-small">3. Click to play the film. Enjoy!</h2>
          <img className="play-film" src={playFilmImg} alt="click to play the film" onClick={() => setPlay(true)} />
        </div>,
      );
    }
  }

  return (
    <div className="home">
      <img className="arm" src={arm} alt="arm and hand pointing to button" />
      {phases}

      {play && video && (
        <Modal
          title={null}
          centered
          visible={play}
          footer={null}
          padding={0}
          width="700"
          closeIcon={closeIcon}
          onCancel={() => setPlay(false)}
        >
          <Vimeo video={video} width="700" height="390" style={{ backgroundColor: "transparent" }} showTitle={false} />
        </Modal>
      )}
    </div>
  );
}

export default Home;
