import React from "react";
import { Input } from "antd";
// added display of 0 instead of NaN if gas price is not provided

/**
  ~ What it does? ~

  Displays gas gauge and allows for custom gas values in Gwei
 
**/

export const gasPrice = { wei: 25000000000 };

export default class GasGauge extends React.Component {
  constructor(props) {
    // Init props and state
    super(props);
    this.state = {
      gasPrice: gasPrice.wei,
    };
  }
  setGasPrice(_gasPrice) {
    _gasPrice = _gasPrice * 10 ** 9;
    this.setState({ gasPrice: _gasPrice });
    gasPrice.wei = _gasPrice;
  }
  render() {
    return (
      <div>
        <Input
          value={parseInt(this.state.gasPrice, 10) / 10 ** 9}
          shape="round"
          onChange={e => {
            this.setGasPrice(e.target.value);
          }}
          suffix={
            <span style={{ marginRight: 8 }}>
              <span role="img" aria-label="fuelpump">
                Gwei⛽️
              </span>
            </span>
          }
        />
      </div>
    );
  }
}
