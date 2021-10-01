import axios from "axios";
import { usePoller } from "eth-hooks";
import { useState } from "react";
import { useEffect } from "react";

export default function useCurrentDistribution(serverUrl, address) {
  const [currentDistribution, setCurrentDistribution] = useState({});
  const [isVoter, setIsVoter] = useState(false);

  const loadCurrentDistribution = async () => {
    axios
      .get(serverUrl + "currentDistribution")
      .then(response => {
        console.log(response);
        setCurrentDistribution(response.data);
        setIsVoter(response.data.members.includes(address.toLowerCase()));
      })
      .catch(error => {
        console.log(error);
        setCurrentDistribution({});
        setIsVoter(false);
      });
  };

  usePoller(loadCurrentDistribution, 10000);
  return [currentDistribution, isVoter, setCurrentDistribution];
}
