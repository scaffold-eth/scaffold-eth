import { Typography, Button } from "antd";
import { useContractReader } from "eth-hooks";
import React, { useEffect, useState } from "react";
import { getFromIPFS } from "../helpers/ipfs";
import { ethers } from "ethers";
import Address from "./Address";

const zeroAddress = "0x0000000000000000000000000000000000000000";

const Poem = ({ tx, writeContracts, readContracts, poem, ensProvider }) => {
  const [poemText, setPoemText] = useState("");
  const owner = useContractReader(readContracts, "Poems", "mintedBy", [poem.data.poet, poem.data.poem]) || zeroAddress;

  const isNotMinted = ethers.utils.getAddress(owner) === ethers.utils.getAddress(zeroAddress);

  const loadPoem = async () => {
    const content = await getFromIPFS(poem.data.poem);
    setPoemText(content);
  };

  const mint = async () => {
    // console.log();
    // reconstruct data
    const amount = ethers.BigNumber.from(poem.data.amount._hex);

    const data = ["0", poem.data.poet, amount, poem.data.title, poem.data.poem];

    tx(writeContracts.Poems.mintPoem(poem.signature, data, { value: amount }));
  };

  useEffect(() => {
    if (poem.data.poem) {
      loadPoem();
    }
  }, [poem.data.poem]);

  return (
    <div
      style={{ width: "100%", marginBottom: "10px", paddingTop: "10px", paddingBottom: "10px", border: "1px solid" }}
    >
      <div>
        <Typography.Text style={{ fontWeight: "600" }}>Title: {poem.data.title}</Typography.Text>
      </div>
      <div>
        <Typography.Text>
          Poet: <Address fontSize={14} address={poem.data.poet} ensProvider={ensProvider} />{" "}
        </Typography.Text>
      </div>
      {!isNotMinted && (
        <div>
          <Typography.Text>
            Current Owner: <Address fontSize={14} address={owner} ensProvider={ensProvider} />{" "}
          </Typography.Text>
        </div>
      )}

      <Typography.Paragraph style={{ marginTop: "10px" }}>Poem: {poemText}</Typography.Paragraph>

      {isNotMinted && (
        <div>
          <Button onClick={mint}>
            Mint Poem for{" "}
            {poem.data?.amount && ethers.utils.formatUnits(ethers.BigNumber.from(poem.data.amount._hex).toString())} Ξ
          </Button>
        </div>
      )}
    </div>
  );
};

export default Poem;
