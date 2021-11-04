import Address from "./Address";
import React from "react";

// displays a page footer

export default function Footer({ mainnetProvider }) {
  return (
    <div class="footer">
      <span>Created by</span>
      <span class="address">
        <Address value={"damianmarti.eth"} ensProvider={mainnetProvider} fontSize={18} />
      </span>
      <span>with</span>
      <a href="https://github.com/scaffold-eth/scaffold-eth" target="_blank" rel="noopener noreferrer">
        🏗 scaffold-eth
      </a>
      <span class="sub">forkable Ethereum dev stack focused on fast product iteration</span>
    </div>
  );
}
