import React from "react";
import { Typography } from "antd";

const { Title, Text } = Typography;

// displays a page header

export default function Header({ link, title, subTitle, ...props }) {
  return (
    <div>
      <div style={{ float: "right", marginTop: 20, marginRight: 20 }}>
        {props.children}
      </div>
      <div style={{ margin: "0 auto", width: 400 }}>
        <img src="loogie-earring.svg" width="400" alt="FancyLoogie with Earring" style={{ marginTop: -100, marginBottom: -100 }} />
      </div>
    </div>
  );
}
