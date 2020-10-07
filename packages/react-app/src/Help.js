import React from "react";

export default function Help() {
  return(
    <div>
    <h3>- Connect with MetaMask</h3>
    <ul>
      <p>
        1- Open Metamask, and select "Custom RPC" from the Network Dropdown.
      </p>
      <img
        width="300"
        src="https://gblobscdn.gitbook.com/assets%2F-Lpi9AHj62wscNlQjI-l%2F-M4oHJb9sfXw_T_UxNG_%2F-M4oHQEsI2DlDy9y2UgE%2Fcustom-rpc.png?alt=media&token=88e78a8b-c396-4f10-8390-f90cece906fe"
        alt="metamask"
      />
      <p>
        2- In the "Custom RPC" Settings, add in the xDai network details and
        click Save:
      </p>

      <li>Network Name: <b>xDai</b></li>
      <li>New RPC URL: <b>https://rpc.xdaichain.com</b></li>
      <li>ChainID (Optional): <b>100</b></li>
      <li>Symbol: <b>xDai</b></li>
      <li>Block Explorer URL: <b>https://blockscout.com/poa/xdai</b></li>
    </ul>
    <h3>- Export burning wallet private key</h3>
    <ul>
      <li>Bla bla bla</li>
      <li>Bla bla bla</li>
    </ul>
    </div>
  )
}
