import React from "react";
import { PageHeader } from "antd";

// displays a page header

export default function Header() {
  return (
    <a href="https://github.com/austintgriffith/scaffold-eth" target="_blank" rel="noopener noreferrer">
      <PageHeader
        title="Bufficorn Buidl Brigade"
        subTitle=""
        style={{ cursor: "pointer", backgroundColor: '#141414', fontFamily: "'Avenir', sans-serif", textTransform: 'uppercase', fontStyle: "italic", fontWeight: '900 !important' }}
      />
    </a>
  );
}
