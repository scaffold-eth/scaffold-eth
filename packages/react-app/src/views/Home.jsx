import { useContractReader } from "eth-hooks";
import { ethers } from "ethers";
import React from "react";
import { Link } from "react-router-dom";

/**
 * web3 props can be passed from '../App.jsx' into your local view component for use
 * @param {*} yourLocalBalance balance on current network
 * @param {*} readContracts contracts from current chain already pre-loaded using ethers contract module. More here https://docs.ethers.io/v5/api/contract/contract/
 * @returns react component
 **/
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
          packages/react-app/src/views/Home.jsx
        </span>
      </div>
      <div style={{ fontWeight: "bolder" }}>You have four contracts to play with :</div>
      <div style={{ margin: 32 }}>
        <span style={{ fontWeight: "bolder" }}>1.</span>
        <span
          className="highlight"
          style={{ marginLeft: 4, /* backgroundColor: "#f9f9f9", */ padding: 4, borderRadius: 4, fontWeight: "bolder" }}
        >
          YourContract.sol
        </span>{" "}
        <span
          style={{ marginLeft: 4, /* backgroundColor: "#f9f9f9", */ padding: 4, borderRadius: 4, fontWeight: "bolder" }}
        >
          (/packages/hardhat/contracts/YourContract.sol)
        </span>
      </div>
      <div style={{ margin: 32 }}>
        <span style={{ marginLeft: 4, marginTop: -10, /* backgroundColor: "#f9f9f9", */ padding: 4, borderRadius: 4 }}>
          In this contract, you will store a string `newPurpose` in the Contract and read it later from the Smart
          Contract
        </span>
      </div>
      <span style={{ fontSize: 18, fontWeight: "bolder" }}>OR</span>
      <div style={{ margin: 32 }}>
        <span style={{ fontWeight: "bolder" }}>2.</span>
        <span
          className="highlight"
          style={{ marginLeft: 4, /* backgroundColor: "#f9f9f9", */ padding: 4, borderRadius: 4, fontWeight: "bolder" }}
        >
          SwapOnUniswap.sol
        </span>{" "}
        <span
          style={{ marginLeft: 4, /* backgroundColor: "#f9f9f9", */ padding: 4, borderRadius: 4, fontWeight: "bolder" }}
        >
          (packages/hardhat/contracts/SwapOnUniswap.sol)
        </span>
      </div>
      <div style={{ margin: 32 }}>
        <span style={{ marginLeft: 4, marginTop: -10, /* backgroundColor: "#f9f9f9", */ padding: 4, borderRadius: 4 }}>
          In this contract, you will store be swapping any two tokens (of your choice, from a drop-down list available)
          on UniswapV2
        </span>
      </div>
      <div style={{ margin: 32 }}>
        <span style={{ fontWeight: "bolder" }}>3.</span>
        <span
          className="highlight"
          style={{ marginLeft: 4, /* backgroundColor: "#f9f9f9", */ padding: 4, borderRadius: 4, fontWeight: "bolder" }}
        >
          NFT.sol
        </span>{" "}
        <span
          style={{ marginLeft: 4, /* backgroundColor: "#f9f9f9", */ padding: 4, borderRadius: 4, fontWeight: "bolder" }}
        >
          (packages/hardhat/contracts/NFT.sol)
        </span>
      </div>
      <div style={{ margin: 32 }}>
        <span style={{ marginLeft: 4, marginTop: -10, /* backgroundColor: "#f9f9f9", */ padding: 4, borderRadius: 4 }}>
          In this contract, you can mint NFTs
        </span>
      </div>
      <div style={{ margin: 32 }}>
        <span style={{ fontWeight: "bolder" }}>4.</span>
        <span
          className="highlight"
          style={{ marginLeft: 4, /* backgroundColor: "#f9f9f9", */ padding: 4, borderRadius: 4, fontWeight: "bolder" }}
        >
          DEX.sol
        </span>{" "}
        <span
          style={{ marginLeft: 4, /* backgroundColor: "#f9f9f9", */ padding: 4, borderRadius: 4, fontWeight: "bolder" }}
        >
          (packages/hardhat/contracts/DEX.sol)
        </span>
      </div>
      <div style={{ margin: 32 }}>
        <span style={{ marginLeft: 4, marginTop: -10, /* backgroundColor: "#f9f9f9", */ padding: 4, borderRadius: 4 }}>
          In this contract, you will create your own DEX and swap tokens, provide liquidity and withdraw liquidity.
        </span>
      </div>
      <div style={{ margin: 32 }}>
        <span style={{ fontWeight: "bolder" }}>5.</span>
        <span
          className="highlight"
          style={{ marginLeft: 4, /* backgroundColor: "#f9f9f9", */ padding: 4, borderRadius: 4, fontWeight: "bolder" }}
        >
          Lending.sol
        </span>{" "}
        <span
          style={{ marginLeft: 4, /* backgroundColor: "#f9f9f9", */ padding: 4, borderRadius: 4, fontWeight: "bolder" }}
        >
          (packages/hardhat/contracts/lending.sol)
        </span>
      </div>
      <div style={{ margin: 32 }}>
        <span style={{ marginLeft: 4, marginTop: -10, /* backgroundColor: "#f9f9f9", */ padding: 4, borderRadius: 4 }}>
          In this contract, you will create your own Lending protocol, lend and borrow tokens.
        </span>
      </div>

      <div style={{ margin: 32 }}>
        <span style={{ fontWeight: "bolder" }}>6.</span>
        <span
          className="highlight"
          style={{ marginLeft: 4, /* backgroundColor: "#f9f9f9", */ padding: 4, borderRadius: 4, fontWeight: "bolder" }}
        >
          ArbitrageFlashLoan.sol
        </span>{" "}
        <span
          style={{ marginLeft: 4, /* backgroundColor: "#f9f9f9", */ padding: 4, borderRadius: 4, fontWeight: "bolder" }}
        >
          (packages/hardhat/contracts/ArbitrageFlashLoan.sol)
        </span>
      </div>
      <div style={{ margin: 32 }}>
        <span style={{ marginLeft: 4, marginTop: -10, /* backgroundColor: "#f9f9f9", */ padding: 4, borderRadius: 4 }}>
          In this contract, you will create your own ArbitrageFlashLoan BoT.
        </span>
      </div>

      <div style={{ margin: 32 }}>
        <span style={{ marginRight: 8 }}>🍴</span>
        For this deploying SwapOnUniswap,DEX, NFT, Lending,ArbitrageFlashLoan on mainnet:
        <br />
        <span>Create your private testnet, forked from ethereum mainnet, with</span>
        <span
          className="highlight"
          style={{ marginLeft: 4, /* backgroundColor: "#f9f9f9", */ padding: 4, borderRadius: 4, fontWeight: "bolder" }}
        >
          yarn fork-bb
        </span>{" "}
      </div>
      <div style={{ margin: 32 }}>
        <span style={{ marginRight: 8 }}>🛰</span>
        Deploy your smart contract with{" "}
        <span
          className="highlight"
          style={{ marginLeft: 4, /* backgroundColor: "#f9f9f9", */ padding: 4, borderRadius: 4, fontWeight: "bolder" }}
        >
          yarn deploy
        </span>{" "}
      </div>
      {/* <div style={{ margin: 32, fontWeight: "bolder" }}>FAUCET</div> */}
      <div style={{ margin: 32 }}>
        <span style={{ marginRight: 8 }}>🚰</span>
        You can access the faucet from terminal with :
        <br />
        <span
          className="highlight"
          style={{ marginLeft: 4, /* backgroundColor: "#f9f9f9", */ padding: 4, borderRadius: 4, fontWeight: "bolder" }}
        >
          yarn faucet-bb native {`<Insert Amount (optional)> <Insert Your Wallet Address>`}
        </span>
        <span> and this will mint your native tokens</span>{" "}
      </div>
      <div style={{ margin: 32 }}>
        <span style={{ marginRight: 8 }}>🚰</span>
        You can access the erc20 faucet from terminal with :
        <br />
        <span
          className="highlight"
          style={{ marginLeft: 4, /* backgroundColor: "#f9f9f9", */ padding: 4, borderRadius: 4, fontWeight: "bolder" }}
        >
          yarn faucet-bb USDC {`<Insert Amount (optional)> <Insert Your Wallet Address>`}
        </span>
        <span> and this will mint USDC tokens</span>{" "}
      </div>
      {!purpose ? (
        <div style={{ margin: 32 }}>
          <span style={{ marginRight: 8 }}>👷‍♀️</span>
          You haven't deployed your contract yet, run
          <span
            className="highlight"
            style={{
              marginLeft: 4,
              /* backgroundColor: "#f9f9f9", */ padding: 4,
              borderRadius: 4,
              fontWeight: "bolder",
            }}
          >
            yarn chain
          </span>{" "}
          and{" "}
          <span
            className="highlight"
            style={{
              marginLeft: 4,
              /* backgroundColor: "#f9f9f9", */ padding: 4,
              borderRadius: 4,
              fontWeight: "bolder",
            }}
          >
            yarn deploy
          </span>{" "}
          to deploy your first contract!
        </div>
      ) : (
        <div style={{ margin: 32 }}>
          <span style={{ marginRight: 8 }}>🤓</span>
          The "purpose" variable from your contract is{" "}
          <span
            className="highlight"
            style={{
              marginLeft: 4,
              /* backgroundColor: "#f9f9f9", */ padding: 4,
              borderRadius: 4,
              fontWeight: "bolder",
            }}
          >
            {purpose}
          </span>
        </div>
      )}

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
