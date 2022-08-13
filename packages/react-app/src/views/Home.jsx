import { Button } from "antd";
import React, { useState } from "react";
import Lit from "../helpers/Lit";

/**
 * web3 props can be passed from '../App.jsx' into your local view component for use
 * @param {*} yourLocalBalance balance on current network
 * @param {*} readContracts contracts from current chain already pre-loaded using ethers contract module. More here https://docs.ethers.io/v5/api/contract/contract/
 * @returns react component
 **/
function Home({ yourLocalBalance, readContracts }) {
  const [message, setMessage] = useState();
  const [decryptedMessage, setDecryptedMessage] = useState();
  const [encryptedFile, setEncryptedFile] = useState();
  const [encryptedSymmetricKey, setEncryptedSymmetricKey] = useState();

  // Lit Encrypt
  const litProtocolEncrypt = async () => {
    console.log("Message to save with Lit: ", message);
    await Lit.encryptString(JSON.stringify(message)).then(result => {
      console.log("Encryption of message result: ", result);
      setEncryptedFile(result.encryptedFile);
      setEncryptedSymmetricKey(result.encryptedSymmetricKey);
      console.log("Encrypted Message: ", result.encryptedFile);
    });
  };

  // Lit Decrypt
  const litProtocolDecrypt = async () => {
    console.log("Decrypting from Lit");
    let decrypted = await Lit.decryptString(encryptedFile, encryptedSymmetricKey);
    setDecryptedMessage(decrypted);
    // this should be the decrypted message
    console.log("Decrypted message: ", JSON.parse(decrypted));
    document.getElementById("decrypted-message").innerHTML = "Decrypted message: " + JSON.parse(decrypted);
  };

  const btnStyle = {
    padding: "5px",
  };

  const inputStyle = {
    padding: "5px",
  };

  return (
    <div style={{ marginTop: "20px" }}>
      <input style={inputStyle} value={message} type="text" onChange={e => setMessage(e.target.value)} />
      <br />
      <span>{message}</span>
      <br />
      <Button style={btnStyle} onClick={() => litProtocolEncrypt()}>
        Save to Lit 🔥
      </Button>
      <span id="lit-saved"></span>
      <br />
      <br />
      <Button style={btnStyle} onClick={() => litProtocolDecrypt()}>
        Decrypt Message
      </Button>
      <br />
      <span id="decrypted-message"></span>
    </div>
  );
}

export default Home;
