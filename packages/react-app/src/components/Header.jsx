import { Image } from "antd";
import React from "react";

// displays a page header

export default function Header() {
  return (
    <div style={{ paddingTop: 15, paddingBottom: 10, textAlign: "left", paddingLeft: 30, backgroundColor: "rgba(138, 1, 7, 0.4)" }}>
      <Image src="/images/PixelRoll.png" alt="PixelRoll" title="PixelRoll" />
    </div>
  );
}
