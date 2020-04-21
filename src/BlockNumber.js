import { useState } from 'react';
import usePoller from "./Poller.js";

export default function useBlockNumber(provider,pollTime) {

  const [blockNumber, setBlockNumber] = useState();
  usePoller(async ()=>{
    let nextBlockNumber = await provider.getBlockNumber()
    if(nextBlockNumber!=blockNumber){
      setBlockNumber(nextBlockNumber)
    }
  },pollTime?pollTime:1777)

  return blockNumber;
}
