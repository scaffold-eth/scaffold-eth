import axios from "axios";
import { usePoller } from "eth-hooks";
import { useState } from "react";
import { useEffect } from "react";

export default function useCurrentDistribution(serverUrl) {
  const [currentDistribution, setCurrentDistribution] = useState({});

  const loadCurrentDistribution = async () => {
    axios
      .get(serverUrl + "currentDistribution")
      .then(response => {
        console.log(response);
        setCurrentDistribution(response.data);
      })
      .catch(error => {
        console.log(error);
        setCurrentDistribution({});
      });
  };

  usePoller(loadCurrentDistribution, 10000);

  return [currentDistribution, setCurrentDistribution];
}
