import { useState, useEffect } from 'react';
import usePoller from "./Poller.js";
import useBlockNumber from "./BlockNumber.js";

export default function useTimestamp(provider,pollTime) {

  const blockNumber = useBlockNumber(provider,pollTime)

  const [timestamp, setTimestamp] = useState()

  useEffect(() => {
    if(typeof provider !== "undefined"){
      async function getTimestamp() {
        let nextBlock = await provider.getBlock(blockNumber)
        if(typeof nextBlock !== "undefined" && nextBlock && nextBlock.timestamp){
          const nextTimestamp = nextBlock.timestamp
          if(nextTimestamp!==timestamp){
            setTimestamp(nextTimestamp)
          }
        }
      }
      getTimestamp();
    }
  }, [provider,blockNumber]);

  return timestamp;
}

