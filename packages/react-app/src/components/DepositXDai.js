import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ethers } from "ethers";
import { SendOutlined, SmileOutlined } from "@ant-design/icons";
import { Row, Col, List, Typography, Spin, InputNumber, Input, Card, notification, Popover, Tooltip, Modal, Divider } from "antd";
import { parseEther, formatEther, formatUnits } from "@ethersproject/units";
import { TokenBalance } from "."
import { useTokenBalance, useBalance, usePoller } from "eth-hooks";
import { Transactor } from "../helpers"
import { JsonRpcProvider } from "@ethersproject/providers";
import { INFURA_ID } from "../constants";
const { Text } = Typography;

const mainnetProvider = new JsonRpcProvider(`https://mainnet.infura.io/v3/${INFURA_ID}`)
const xDaiProvider = new JsonRpcProvider(`https://dai.poa.network`)

const daiTokenAddress = '0x6B175474E89094C44Da98b954EedeAC495271d0F'
const xDaiBridgeAddress = '0x7301CFA0e1756B71869E93d4e4Dca5c7d0eb0AA6'
const mainnetBridgeAddress = '0x4aa42145aa6ebf72e164c9bbc74fbd3788045016'

const decimals = 18

const xDaiChainId = 100
const mainnetChainId = 1

const minAmountToTransfer = "10"

function DepositXDai({address, selectedProvider}) {

  const [enteredAmount, setEnteredAmount] = useState('')
  const [fromMainTx, setFromMainTx] = useState()
  const [selectedNetwork, setSelectedNetwork] = useState()

  const tx = Transactor(selectedProvider)
  let userSigner = selectedProvider.getSigner()

  const erc20Abi = [
      // Read-Only Functions
      "function balanceOf(address owner) view returns (uint256)",
      "function decimals() view returns (uint8)",
      "function symbol() view returns (string)",

      // Authenticated Functions
      "function transfer(address to, uint amount) returns (boolean)",

      // Events
      "event Transfer(address indexed from, address indexed to, uint amount)"
  ];

  const mainnetBridgeAbi = [
    "function executeSignatures(bytes message, bytes signatures)"
  ]

  const xDaiHelperAbi = [{"type":"constructor","stateMutability":"nonpayable","inputs":[{"type":"address","name":"_homeBridge","internalType":"address"},{"type":"address","name":"_foreignBridge","internalType":"address"}]},{"type":"function","stateMutability":"view","outputs":[{"type":"address","name":"","internalType":"contract IHomeErc20ToNativeBridge"}],"name":"bridge","inputs":[]},{"type":"function","stateMutability":"nonpayable","outputs":[],"name":"clean","inputs":[]},{"type":"function","stateMutability":"view","outputs":[{"type":"bytes","name":"result","internalType":"bytes"}],"name":"getMessage","inputs":[{"type":"bytes32","name":"_msgHash","internalType":"bytes32"}]},{"type":"function","stateMutability":"view","outputs":[{"type":"bytes32","name":"","internalType":"bytes32"}],"name":"getMessageHash","inputs":[{"type":"address","name":"_recipient","internalType":"address"},{"type":"uint256","name":"_value","internalType":"uint256"},{"type":"bytes32","name":"_origTxHash","internalType":"bytes32"}]},{"type":"function","stateMutability":"view","outputs":[{"type":"bytes","name":"","internalType":"bytes"}],"name":"getSignatures","inputs":[{"type":"bytes32","name":"_msgHash","internalType":"bytes32"}]}]

//"0x6B175474E89094C44Da98b954EedeAC495271d0F" <- dai contract
  let daiContract = new ethers.Contract(daiTokenAddress, erc20Abi, mainnetProvider);
  let xDaiHelperContract = new ethers.Contract("0x6A92e97A568f5F58590E8b1f56484e6268CdDC51", xDaiHelperAbi, xDaiProvider);

  let mainnetBridgeContract = new ethers.Contract(mainnetBridgeAddress, mainnetBridgeAbi, userSigner)

  let daiBalance = useTokenBalance(daiContract, address, 3000)
  let xDaiBalance = useBalance(xDaiProvider, address, 3000)

  const formatBalance = (balance, decimals, places) => {
    let formattedBalance = balance?formatUnits(balance, decimals):null
    return formattedBalance?Number.parseFloat(formattedBalance).toFixed(places?places:3):"loading..."
  }

  useEffect(() => {

  const updateNetwork = async () => {
    if(selectedProvider) {
    let newNetwork = await selectedProvider.getNetwork()
    setSelectedNetwork(newNetwork.chainId)
    }
  }

  updateNetwork()

  }, [selectedProvider])

  const getParsedValue = (v) => {
    let value;
    try {
      value = parseEther("" + v);
    } catch (e) {
      value = parseEther("" + parseFloat(v).toFixed(8));
    }
    return value
  }

  const checkAgainstMinimumTransfer = (v, minTransfer) => {
    if(parseFloat(v) < parseFloat(minTransfer)) {
      notification.open({
        message: 'Amount is less than the minimum allowed transfer',
        description:
        `The minimum transfer is ${minTransfer}`,
      });
        return false
    } else {
        return true
      }
  }

  const sendDaiToBridge = async () => {

    if(checkAgainstMinimumTransfer(enteredAmount, minAmountToTransfer) == false) return

    let parsedValue = getParsedValue(enteredAmount)
    let valueString = parsedValue.toLocaleString('fullwide', {useGrouping:false})

    let daiSenderContract = new ethers.Contract(daiTokenAddress, erc20Abi, userSigner);
    try {
      let erc20tx = await daiSenderContract.transfer(
        mainnetBridgeAddress,
        valueString
      );
      console.log(erc20tx)
      setFromMainTx(erc20tx.hash)
      notification.open({
        message: 'Sent Dai to the Bridge contract!',
        description:
        (<a href={"https://etherscan.io/tx/"+erc20tx.hash} target="_blank">{`👀 Sent ${enteredAmount} Dai, click to view transaction`}</a>),
      });
      setEnteredAmount('')
    } catch(e){
      console.log(e)
    }

  }

  let bridgeOption

  const updateEnteredAmount = (entered, maxAmount, minAmount) => {
    if(parseFloat(maxAmount) < parseFloat(minAmount)) {
      notification.open({
        message: 'Balance is less than the minimum allowed transfer',
        description:
        `The minimum transfer is ${minAmount}`,
      });
      return
    }
    if(parseFloat(entered) > parseFloat(maxAmount)) {
      setEnteredAmount(maxAmount)
      notification.open({
        message: `You can't transfer more than your balance!`,
        description:
        `Your balance is ${maxAmount}`,
      });
    } else {
      setEnteredAmount(entered)
    }
  }

  if(selectedNetwork == mainnetChainId || parseInt(selectedNetwork) == mainnetChainId) {
      bridgeOption = (
      <>
      <div class="nes-field">
        {daiBalance>0?<input id="dai_to_xdai" class="nes-input" placeholder="dai to xdai"
        onChange={async e => {
          let maxBalance = formatBalance(daiBalance, decimals)
          updateEnteredAmount(e.target.value, maxBalance, minAmountToTransfer)
        }}
        value={enteredAmount}
        />:<input type="text" id="warning_field" class="nes-input" disabled placeholder="No dai to transfer"/>}
      </div>
      <button type="button" class="nes-btn is-primary" disabled={enteredAmount==""}
      onClick={sendDaiToBridge}
      >↓</button>
      </>
      )
    } else {
      bridgeOption = <span>Select mainnet to use the bridge</span>
    }

  return (
    <>
              <Row>
                <Col>
                <Row>
                <Text style={{
                  verticalAlign: "middle",
                  fontSize: 32,
                  padding: 8,
                }}>
                  {'dai ' + formatBalance(daiBalance, decimals)}
                </Text>
                </Row>
                  <Row>
                  {bridgeOption}
                  </Row>
                  <Row>
                  <Text style={{
                    verticalAlign: "middle",
                    fontSize: 32,
                    padding: 8,
                  }}>
                    {'xDai ' + formatBalance(xDaiBalance, decimals)}
                  </Text>
                  </Row>
                </Col>
              </Row>
              </>
  );
}

export default DepositXDai;
