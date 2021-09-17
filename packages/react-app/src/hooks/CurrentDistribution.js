import axios from "axios";
import { usePoller } from "eth-hooks";
import { useState } from "react";
import { useEffect } from "react";

export default function useCurrentDistribution(serverUrl, address) {
  const [currentDistribution, setCurrentDistribution] = useState({});
  const [isVoter, setIsVoter] = useState(false);

  useEffect(() => {
    axios
      .get(serverUrl + "currentDistribution")
      .then(response => {
        console.log(response);
        setCurrentDistribution(response.data);
        setIsVoter(response.data.data.members.includes(address));
      })
      .catch(error => console.log(error));
  }, [serverUrl, address]);

  return [currentDistribution, isVoter];
}
