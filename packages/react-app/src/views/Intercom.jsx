import React from "react";
import { Receiver, InlineLaunch } from "relaycc/receiver";

export default function Intercom() {
  return (
    <>
      <h1>Implementing Intercom</h1>

      <div>This is the Intercom page</div>
      <Receiver>
        <InlineLaunch peerAddress="0x7643B3E34039ADE2db0f64C9Be4907B2FcE63B2A" />
      </Receiver>
    </>
  );
}
