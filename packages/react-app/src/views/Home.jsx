import React from "react";
import { Link } from "react-router-dom";
import { useContractReader } from "eth-hooks";
import { ethers } from "ethers";

/**
 * web3 props can be passed from '../App.jsx' into your local view component for use
 * @param {*} yourLocalBalance balance on current network
 * @param {*} readContracts contracts from current chain already pre-loaded using ethers contract module. More here https://docs.ethers.io/v5/api/contract/contract/
 * @returns react component
 */
function Home({ yourLocalBalance, readContracts }) {
  // you can also use hooks locally in your component of choice
  // in this case, let's keep track of 'purpose' variable from our contract
  const purpose = useContractReader(readContracts, "YourContract", "purpose");

  return (
    <div>
      <div style={{ margin: 32 }}>
        <span style={{ marginRight: 8 }}>📝</span>
        This Is Your App Home. You can start editing it in{" "}
        <span
          className="highlight"
          style={{ marginLeft: 4, /* backgroundColor: "#f9f9f9", */ padding: 4, borderRadius: 4, fontWeight: "bolder" }}
        >
          packages/react-app/views/Home.jsx
        </span>
      </div>
      <div style={{ margin: 32 }}>
        <span style={{ marginRight: 8 }}>🤓</span>
        The "purpose" variable from our contract is{" "}
        <span
          className="highlight"
          style={{ marginLeft: 4, /* backgroundColor: "#f9f9f9", */ padding: 4, borderRadius: 4, fontWeight: "bolder" }}
        >
          {purpose}
        </span>
      </div>
      <div style={{ margin: 32 }}>
        <span style={{ marginRight: 8 }}>🤖</span>
        An example prop of your balance{" "}
        <span style={{ fontWeight: "bold", color: "green" }}>({ethers.utils.formatEther(yourLocalBalance)})</span> was
        passed into the
        <span
          className="highlight"
          style={{ marginLeft: 4, /* backgroundColor: "#f9f9f9", */ padding: 4, borderRadius: 4, fontWeight: "bolder" }}
        >
          Home.jsx
        </span>{" "}
        component from
        <span
          className="highlight"
          style={{ marginLeft: 4, /* backgroundColor: "#f9f9f9", */ padding: 4, borderRadius: 4, fontWeight: "bolder" }}
        >
          App.jsx
        </span>
      </div>
      <div style={{ margin: 32 }}>
        <span style={{ marginRight: 8 }}>💭</span>
        Check out the <Link to="/hints">"Hints"</Link> tab for more tips.
      </div>
      <div style={{ margin: 32 }}>
        <span style={{ marginRight: 8 }}>🛠</span>
        Tinker with your smart contract using the <Link to="/debug">"Debug Contract"</Link> tab.
      </div>
    </div>
  );
}

export default Home;
