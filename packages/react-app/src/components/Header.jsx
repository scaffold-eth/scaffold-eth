import { PageHeader } from "antd";
import React from "react";

// displays a page header

export default function Header( props ) {
  return (

      <PageHeader
        title={(
          <a href="https://punkwallet.io" style={{color:"#48a9a6"}}>
            {window.innerWidth<600?"🦉":"🦉 gno.cash"}
          </a>
        )}
        /*subTitle=<a href="https://github.com/scaffold-eth/scaffold-eth/tree/punk-wallet">
          {window.innerWidth<600?"":"info/code"}
        </a>*/
        style={{ cursor: "pointer",fontSize:32 }}
        extra={props.extra}
      />

  );
}
