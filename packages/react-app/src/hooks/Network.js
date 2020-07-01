import { useState } from 'react';
import usePoller from "./Poller.js";

export default function useNetwork(provider,pollTime) {

  const [network, setNetwork] = useState();

  usePoller(() => {
    if(typeof provider !== "undefined"){
      async function getNetwork() {
        let nextNetwork = await provider.getNetwork()
        if(nextNetwork!==network){
          setNetwork(nextNetwork)
        }
      }
      getNetwork();
    }
  },pollTime?pollTime:1777)

  return network;
}
