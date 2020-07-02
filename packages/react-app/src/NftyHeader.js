import React from 'react'
import { PageHeader } from 'antd';
import { Account } from "./components"
import NftyWallet from "./NftyWallet.js"

export default function NftyHeader(props) {
  return (
    <div>
      <PageHeader
        title={<a href="https://github.com/austintgriffith/scaffold-eth">🧑‍🎨  Nifty Ink </a>}
        subTitle={
          <NftyWallet
          address={props.address}
          readContracts={props.readContracts}
          injectedProvider={props.injectedProvider}
          mainnetProvider={props.mainnetProvider}/>
        }
        style={{cursor:'pointer'}}
        extra= {
        [
        <Account
          address={props.address}
          setAddress={props.setAddress}
          localProvider={props.localProvider}
          injectedProvider={props.injectedProvider}
          setInjectedProvider={props.setInjectedProvider}
          mainnetProvider={props.mainnetProvider}
          hideInterface={props.hideInterface}
          price={props.price}
          minimized={props.minimized}
      />]}
      />
    </div>
  );
}
