import { utils } from "ethers";
import { Box, Select } from "@chakra-ui/react";
import React, { useState } from "react";
import { Address, AddressInput, HighlightText, Card } from "../components";
import { useTokenList } from "eth-hooks/dapps/dex";

export default function Hints({ yourLocalBalance, mainnetProvider, price, address }) {
  // Get a list of tokens from a tokenlist -> see tokenlists.org!
  const [selectedToken, setSelectedToken] = useState("Pick a token!");
  const listOfTokens = useTokenList(
    "https://raw.githubusercontent.com/SetProtocol/uniswap-tokenlist/main/set.tokenlist.json",
  );

  return (
    <Card>
      <Box>
        <span style={{ marginRight: 8 }}>👷</span>
        Edit your <b>contract</b> in
        <HighlightText>packages/hardhat/contracts</HighlightText>
      </Box>

      <Box>
        <span style={{ marginRight: 8 }}>🛰</span>
        <b>compile/deploy</b> with
        <HighlightText>yarn run deploy</HighlightText>
      </Box>

      <Box>
        <span style={{ marginRight: 8 }}>🚀</span>
        Your <b>contract artifacts</b> are automatically injected into your frontend at
        <HighlightText>packages/react-app/src/contracts/</HighlightText>
      </Box>

      <Box>
        <span style={{ marginRight: 8 }}>🎛</span>
        Edit your <b>frontend</b> in
        <HighlightText>packages/reactapp/src/App.js</HighlightText>
      </Box>

      <Box>
        <span style={{ marginRight: 8 }}>🔭</span>
        explore the
        <HighlightText>🖇 hooks</HighlightText> and
        <HighlightText>📦 components</HighlightText>
      </Box>

      <Box>
        for example, the
        <HighlightText>useBalance()</HighlightText>
        hook keeps track of your balance: <b>{utils.formatEther(yourLocalBalance || 0)}</b>
      </Box>

      <div style={{ margin: 8 }}>
        <div>
          <b>useTokenList()</b> can get you an array of tokens from{" "}
          <a href="https://tokenlists.org" target="_blank" rel="noopener noreferrer">
            tokenlists.org!
          </a>
        </div>
        <Select
          value={selectedToken}
          onChange={value => {
            console.log(`selected ${value}`);
            setSelectedToken(value);
          }}
        >
          {listOfTokens.map(token => (
            <option key={token.symbol} value={token.symbol}>
              {token.symbol}
            </option>
          ))}
        </Select>
      </div>

      <Box>
        as you build your app you&apos;ll need web3 specific components like an
        <HighlightText>{"<AddressInput/>"}</HighlightText>
        component:
        <div style={{ width: 350, padding: 16, margin: "auto" }}>
          <AddressInput ensProvider={mainnetProvider} />
        </div>
        <div>(try putting in your address, an ens address, or scanning a QR code)</div>
      </Box>

      <Box>
        this balance could be multiplied by
        <HighlightText>price</HighlightText> that is loaded with the
        <HighlightText>usePrice</HighlightText> hook with the current value: <b>${price}</b>
      </Box>

      <Box>
        <span style={{ marginRight: 8 }}>💧</span>
        use the <b>faucet</b> to send funds to
        <HighlightText>
          <Address address={address} minimized /> {address}
        </HighlightText>
      </Box>

      <Box>
        <span style={{ marginRight: 8 }}>📡</span>
        deploy to a testnet or mainnet by editing
        <HighlightText>packages/hardhat/hardhat.config.js</HighlightText>
        and running
        <HighlightText>yarn run deploy</HighlightText>
      </Box>

      <Box>
        <span style={{ marginRight: 8 }}>🔑</span>
        <HighlightText>yarn run generate</HighlightText>
        will create a deployer account in
        <HighlightText>packages/hardhat</HighlightText>
        <div style={{ marginTop: 8 }}>
          (use{" "}
          <span
            className="highlight"
            style={{
              marginLeft: 4,
              /* backgroundColor: "#f1f1f1", */ padding: 4,
              borderRadius: 4,
              fontWeight: "bolder",
            }}
          >
            yarn run account
          </span>{" "}
          to display deployer address and balance)
        </div>
      </Box>

      <Box>
        <span style={{ marginRight: 8 }}>⚙️</span>
        build your app with
        <HighlightText>yarn run build</HighlightText>
      </Box>

      <Box>
        <span style={{ marginRight: 8 }}>🚢</span>
        ship it!
        <HighlightText>yarn run surge</HighlightText>
        or
        <HighlightText>yarn run s3</HighlightText>
        or
        <HighlightText>yarn run ipfs</HighlightText>
      </Box>

      <Box>
        <span style={{ marginRight: 8 }}>💬</span>
        for support, join this
        <HighlightText>
          <a target="_blank" rel="noopener noreferrer" href="https://t.me/joinchat/KByvmRe5wkR-8F_zz6AjpA">
            Telegram Chat
          </a>
        </HighlightText>
      </Box>
      <div style={{ padding: 128 }}>
        🛠 Check out your browser&apos;s developer console for more... (inspect console) 🚀
      </div>
    </Card>
  );
}
