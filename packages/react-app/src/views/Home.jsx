import { useContractReader } from "eth-hooks";
import { ethers } from "ethers";
import React from "react";
import { Link } from "react-router-dom";
import useMultiCall from "../hooks/useMulticall";

/**
 * web3 props can be passed from '../App.jsx' into your local view component for use
 * @param {*} yourLocalBalance balance on current network
 * @param {*} readContracts contracts from current chain already pre-loaded using ethers contract module. More here https://docs.ethers.io/v5/api/contract/contract/
 * @returns react component
 **/
function Home({ yourLocalBalance, readContracts, localProvider }) {
  // you can also use hooks locally in your component of choice
  // in this case, let's keep track of 'purpose' variable from our contract
  const purpose = useContractReader(readContracts, "YourContract", "purpose");

  const results = useMultiCall(
    readContracts,
    {
      DAI: {
        balanceOf: [
          { key: "vitalik", params: ["0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045"] },
          { key: "austin", params: ["0x34aa3f359a9d614239015126635ce7732c18fdf3"] },
        ],
        decimals: [{ key: "DAIdecimals", params: [] }],
      },
      UNI: {
        balanceOf: [
          { key: "ghost", params: ["0xbF7877303B90297E7489AA1C067106331DfF7288"] },
          { key: "jaxcoder", params: ["0xa4ca1b15fe81f57cb2d3f686c7b13309906cd37b"] },
        ],
      },
    },
    localProvider,
  );

  console.log({ results });

  return (
    <div>
      <div style={{ margin: 32 }}>
        <span style={{ marginRight: 8 }}>📝</span>
        This Is Your App Home. You can start editing it in{" "}
        <span
          className="highlight"
          style={{ marginLeft: 4, /* backgroundColor: "#f9f9f9", */ padding: 4, borderRadius: 4, fontWeight: "bolder" }}
        >
          packages/react-app/src/views/Home.jsx
        </span>
      </div>
      <div>
        {Object.keys(results).map(contract => {
          return Object.keys(results[contract]).map(i => {
            return Object.keys(results[contract][i]).map(x => {
              return (
                <div key={`${i}-${x}`}>
                  {contract} => {i} => {x} => {ethers.utils.formatEther(results[contract][i][x][0])}
                </div>
              );
            });
          });
        })}
      </div>
    </div>
  );
}

export default Home;
