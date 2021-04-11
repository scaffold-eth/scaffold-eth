import React from "react";
import { PageHeader, Typography } from "antd";

// displays a page header

export default function Header() {
  return (
    <a href="/">
      <PageHeader
        title={
          <>
          <Typography.Title level={1} style={{ color: "white", marginTop: 50, fontSize: '70px' }}>
            🤝 Good <br />
            Tokens
          </Typography.Title>
          <Typography.Title level={4} style={{ color: "white", marginTop: 0, }}>
            putting NFTs to good work ⚒️
          </Typography.Title>
          
          </>
        }
        style={{
          cursor: "pointer",
          textAlign: "left",
          height: 350,
          backgroundPosition: "100% 10%",
          backgroundSize: "cover",
          backgroundImage: `url(https://www.communities.qld.gov.au/images/dcdss/features/central-qld-bushfires-grants.jpg)`,
        }}
      />
    </a>
  );
}
