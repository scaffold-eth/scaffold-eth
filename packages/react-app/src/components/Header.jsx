import React from "react";
import { PageHeader, Typography } from "antd";

// displays a page header

export default function Header() {
  return (
    <a href="/">
      <PageHeader
        title={
          <Typography.Title style={{ color: "white", marginTop: 50 }}>
            🤝 Good <br />
            Tokens
          </Typography.Title>
        }
        style={{
          cursor: "pointer",
          textAlign: "left",
          height: 250,
          backgroundPosition: "100% 50%",
          backgroundSize: "100%",
          backgroundImage: `url(https://www.unicef.org/ethiopia/sites/unicef.org.ethiopia/files/styles/media_large_image/public/IMG_9057.jpg?itok=aLSI3TTV)`,
        }}
      />
    </a>
  );
}
