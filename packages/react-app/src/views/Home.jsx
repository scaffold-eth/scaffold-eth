import { CaretUpOutlined, RightCircleFilled, ScanOutlined, SendOutlined } from "@ant-design/icons";
import { useContractReader } from "eth-hooks";
import { ethers } from "ethers";
import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { InputNumber, Button } from "antd";
import { useParams } from "react-router-dom";

import AddressInput from "../components/AddressInput";
import QRPunkBlockie from "../components/QRPunkBlockie";
import { useEffect } from "react";

import { Address } from "../components";

/*
/**
 * web3 props can be passed from '../App.jsx' into your local view component for use
 * @param {*} yourLocalBalance balance on current network
 * @param {*} readContracts contracts from current chain already pre-loaded using ethers contract module. More here https://docs.ethers.io/v5/api/contract/contract/
 * @returns react component
 **/
function Home({ yourLocalBalance, address, readContracts, mainnetProvider, selectedChainId, tx, writeContracts }) {
  let history = useHistory();
  // you can also use hooks locally in your component of choice
  // in this case, let's keep track of 'purpose' variable from our contract
  const balance = useContractReader(readContracts, "BuidlGuidlBeans", "balanceOf", [address]);

  const [loading, setLoading] = useState(false);

  const [toAddress, setToAddress] = useState();
  const [amount, setAmount] = useState();

  let scanner;

  let params = useParams();
  useEffect(() => {
    if (params.address) {
      setToAddress(params.address);
      history.push("/");
    }
  }, [params.address]);

  const doSend = async () => {
    setLoading(true);

    let value;
    try {
      console.log("PARSE ETHER", amount);
      value = ethers.utils.parseEther("" + amount);
      console.log("PARSEDVALUE", value);
    } catch (e) {
      const floatVal = parseFloat(amount).toFixed(8);
      console.log("floatVal", floatVal);
      // failed to parseEther, try something else
      value = ethers.utils.parseEther("" + floatVal);
      console.log("PARSEDfloatVALUE", value);
    }

    let txConfig = {
      to: writeContracts.BuidlGuidlBeans.address,
      chainId: selectedChainId,
      data: writeContracts.BuidlGuidlBeans.interface.encodeFunctionData("transfer(address,uint256)", [
        toAddress,
        value,
      ]),
    };

    //txConfig.gasPrice = gasPrice;

    let result = tx(txConfig);
    // setToAddress("")
    setAmount("");
    result = await result;
    console.log(result);
    setLoading(false);
    window.scrollTo(0, 0);
  };

  const handleKey = event => {
    console.log("ENTER", event);
    if (event.key === "Enter") {
      doSend();
    }
  };

  return (
    <div>
      <div
        style={{
          margin: "auto",
          textAlign: "right",
          paddingRight: 64,
          marginTop: 16,
          width: 500,
          fontSize: 96,
          letterSpacing: -0.5,
          opacity: balance ? 1 : 0.02,
        }}
      >
        {balance ? Math.floor(ethers.utils.formatEther(balance)) : "---"}
        <span style={{ fontSize: 32, letterSpacing: 0, opacity: 0.33 }}>beans</span>
        <div style={{ fontSize: 48, position: "absolute", marginLeft: 370, marginTop: -128 }}>🫘</div>
      </div>

      <div style={{ margin: "auto", position: "relative", backgroundColor: "#ffffff", padding: 8, width: 400 }}>
        <QRPunkBlockie withQr={true} address={address} />
        <Address address={address} ensProvider={mainnetProvider} hideBlockie={true} fontSize={18} />
      </div>

      <div style={{ margin: "auto", marginTop: 96, width: 300 }}>
        <div style={{ padding: 16, fontSize: 18, letterSpacing: -0.1 }}>Send</div>
        <AddressInput
          hoistScanner={toggle => {
            scanner = toggle;
          }}
          ensProvider={mainnetProvider}
          placeholder="enter address, ens, or scan QR"
          value={toAddress}
          onChange={setToAddress}
        />
      </div>
      <div style={{ margin: "auto", marginTop: 32, width: 300 }}>
        <InputNumber
          type="number"
          pattern="\d*"
          value={amount}
          onChange={setAmount}
          onKeyPress={handleKey}
          /* 
          onChange={(value)=>{
            setAmount(Math.floor(value))
          }}
          */
        />
        <span style={{ padding: 16, fontSize: 18, letterSpacing: -0.1 }}>beans</span>
      </div>
      <div style={{ margin: "auto", marginTop: 32, width: 500 }}>
        <Button
          style={{ transform: "scale(1.5)", marginTop: 8 }}
          key="submit"
          type="primary"
          disabled={loading || !amount || !toAddress}
          loading={loading}
          onClick={doSend}
        >
          {loading || !amount || !toAddress ? <CaretUpOutlined /> : <SendOutlined style={{ color: "#FFFFFF" }} />} Send
        </Button>

        <div
          style={{
            transform: "scale(4)",
            transformOrigin: "70% 80%",
            position: "fixed",
            textAlign: "right",
            right: 0,
            bottom: 16,
            padding: 10,
            zIndex: 257,
          }}
        >
          <Button
            type="primary"
            shape="circle"
            style={{ zIndex: 257, backgroundColor: "#7f403c", borderColor: "#4b2422" }}
            size="large"
            onClick={() => {
              scanner(true);
            }}
          >
            <ScanOutlined style={{ color: "#FFFFFF" }} />
          </Button>
        </div>
      </div>
      <div style={{ padding: 128 }}></div>
    </div>
  );
}

export default Home;
