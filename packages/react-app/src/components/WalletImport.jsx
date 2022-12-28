import { ethers } from "ethers";
import React, { useEffect, useState } from "react";

import { Button, Input } from "antd";
import Address from "./Address";

export default function WalletImport({ setShowImport }) {
  const [importMnemonic, setImportMnemonic] = useState();
  const [importMnemonicIndex, setImportMnemonicIndex] = useState("0");
  const [password, setPassword] = useState("");
  const [importPrivatekey, setImportPrivatekey] = useState();
  const [importAddress, setImportAddress] = useState();

  useEffect(() => {
    const calculatePK = async () => {
      if (importMnemonic) {
        const ethersSeed = ethers.utils.mnemonicToSeed(importMnemonic, password);
        const ethersHDNode = ethers.utils.HDNode.fromSeed(ethersSeed);

        const wallet_hdpath = "m/44'/60'/0'/0/";
        const fullPath = wallet_hdpath + importMnemonicIndex;

        const ethersDerivedHDNode = ethersHDNode.derivePath(fullPath);
        const ethersPrivateKey = ethersDerivedHDNode.privateKey;

        setImportPrivatekey(ethersPrivateKey);
      } else {
        setImportPrivatekey();
      }
    };
    calculatePK();
  }, [importMnemonic, importMnemonicIndex, password]);

  useEffect(() => {
    const calculateAddress = async () => {
      if (importPrivatekey) {
        try {
          const officialEthersWallet = new ethers.Wallet(importPrivatekey);
          console.log(officialEthersWallet);
          setImportAddress(officialEthersWallet.address);
        } catch (e) {
          console.log(e);
          setImportAddress("");
        }
      }
    };
    calculateAddress();
  }, [importPrivatekey]);

  return (
    <div>
      <div style={{ marginTop: 21, width: 420 }}>
        <h2>IMPORT</h2>
      </div>

      <div style={{ opacity: 0.5 }}>mnemonic</div>
      <Input.Password
        style={{ width: 380 }}
        size="large"
        placeholder="word1 word2 word3"
        onChange={async e => {
          setImportMnemonic(e.target.value);
        }}
      />

      <Input
        style={{ width: 69 }}
        value={importMnemonicIndex}
        onChange={e => {
          setImportMnemonicIndex(e.target.value);
        }}
        size="large"
      />

      <Input.Password
        style={{ width: 380 }}
        size="large"
        placeholder="optional password"
        onChange={async e => {
          setPassword(e.target.value);
        }}
      />

      <div style={{ marginTop: 21, width: 420 }}>
        <h4>OR</h4>
      </div>

      <div style={{ opacity: 0.5 }}>private key</div>
      <Input.Password
        disabled={importMnemonic}
        style={{ width: 420 }}
        size="large"
        value={importPrivatekey}
        placeholder="0x..."
        onChange={e => {
          setImportPrivatekey(e.target.value);
        }}
      />

      <hr />

      {importAddress ? (
        <div style={{ width: 420, height: 200 }}>
          <div style={{ float: "right", marginTop: 64 }}>
            <Address value={importAddress} />
          </div>
          <hr />
        </div>
      ) : (
        ""
      )}

      <div style={{ float: "right" }}>
        <Button
          style={{ marginTop: 16 }}
          disabled={!importPrivatekey || (importMnemonic && importMnemonic.length < 7)} //safety third!
          onClick={() => {
            const currentPrivateKey = window.localStorage.getItem("metaPrivateKey");
            if (currentPrivateKey) {
              window.localStorage.setItem("metaPrivateKey_backup" + Date.now(), currentPrivateKey);
            }

            try {
              const officialEthersWallet = new ethers.Wallet(importPrivatekey.trim());
              console.log(officialEthersWallet);
              setImportAddress(officialEthersWallet.address);
              window.localStorage.setItem("metaPrivateKey", importPrivatekey);
              window.location.reload();
              //setShowImport(!showImport)
            } catch (e) {
              console.log(e);
            }
          }}
        >
          <span style={{ marginRight: 8 }}>💾</span>Save
        </Button>
      </div>

      <Button
        style={{ marginTop: 16 }}
        onClick={() => {
          setShowImport(false);
        }}
      >
        <span style={{ marginRight: 8 }}>⏪</span>Cancel
      </Button>
    </div>
  );
}
