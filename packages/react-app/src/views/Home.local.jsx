import React, { useState } from "react";
import { Button, notification } from "antd";
import Vimeo from "@u-wave/react-vimeo";
import Randomstring from "randomstring";
import { ethers } from "ethers";

function Home({ userSigner, web3Modal, provider, injectedProvider }) {
  const [isSigning, setIsSigning] = useState(false);
  const [isAuth, setIsAuth] = useState(false);

  const sendNotification = (type, data) => {
    return notification[type]({
      ...data,
      placement: "bottomRight",
    });
  };

  const validateUser = async (message, address, signature) => {
    // validate signature
    const recovered = ethers.utils.verifyMessage(message, signature);
    if (recovered.toLowerCase() !== address.toLowerCase()) {
      return false;
    }

    try {
      // validate token balance
      const tokenAddress = "0xE203cDC6011879CDe80c6a1DcF322489e4786eB3";
      const abi = ["function balanceOf(address _owner) external view returns (uint256)"];

      const tokenContract = new ethers.Contract(tokenAddress, abi, provider);

      const balance = await tokenContract.balanceOf(address);

      return balance.gt(0);
    } catch (error) {
      console.log(error);

      return false;
    }
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
      const message = `Web3Auth-${Randomstring.generate(10)}`;
      const address = await userSigner.getAddress();
      let signature = await userSigner.signMessage(message);

      const isValid = await validateUser(message, address, signature);

      if (!isValid) {
        throw new Error("You are not part of this viewing club");
      }

      setIsAuth(isValid);

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
      {isAuth && (
        <div style={{ marginTop: 60 }}>
          <Vimeo video="610454670" showTitle={false} />
        </div>
      )}
    </div>
  );
}

export default Home;
