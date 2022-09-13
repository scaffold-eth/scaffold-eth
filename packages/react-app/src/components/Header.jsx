import { PageHeader } from "antd";
import React from "react";

// displays a page header

export default function Header() {
  return (
    <a
      href="https://github.com/scaffold-eth/scaffold-eth/tree/dice-game-using-future-difficulty-using-block-header"
      target="_blank"
      rel="noopener noreferrer"
    >
      <PageHeader title="⚄ Dice-Random" subTitle="Using RANDAO as randomness source" style={{ cursor: "pointer" }} />
    </a>
  );
}
