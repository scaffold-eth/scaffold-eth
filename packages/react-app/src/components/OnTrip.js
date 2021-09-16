import React, { useEffect, useState } from 'react';

import Geocode from "react-geocode";

import { Spinner } from "baseui/spinner";

Geocode.setApiKey("askmike");


// OnTrip Step
function OnTrip({pickUp, dest,
  tx,
  writeContracts,
}) {
  const  [pickUpLatLong, setPickUpLatLong] = useState([0,0])
  const  [destLatLong, setDestLatLong] = useState([0,0])

  // Geocode the addresses and send to chain

  useEffect(() => {
    // Get latitude & longitude from address.
    Geocode.fromAddress(pickUp).then(
      (response) => {
        const { lat, lng } = response.results[0].geometry.location;
        setPickUpLatLong([lat * 10**3, lng * 10**3])
        console.log("pickup lat long: ", lat, lng);
      },
      (error) => {
        console.error(error);
      }
    );

    Geocode.fromAddress(dest).then(
      (response) => {
        const { lat, lng } = response.results[0].geometry.location;
        setDestLatLong([lat * 10**3, lng * 10**3])
        console.log("dest lat long: ", lat, lng);
      },
      (error) => {
        console.error(error);
      }
    );

        
    // Set the src and dest lat long to the blockchain
    const result = tx(writeContracts.YourContract.request_ride(pickUpLatLong[0], Math.abs(pickUpLatLong[1]), destLatLong[0], Math.abs(destLatLong[1])), update => {
      console.log("📡 Transaction Update:", update);
      if (update && (update.status === "confirmed" || update.status === 1)) {
        console.log(" 🍾 Transaction " + update.hash + " finished!");
        console.log(
          " ⛽️ " +
          update.gasUsed +
          "/" +
          (update.gasLimit || update.gas) +
          " @ " +
          parseFloat(update.gasPrice) / 1000000000 +
          " gwei",
        );
      }
    });
    console.log("awaiting metamask/web3 confirm result...", result);
    console.log(result);

  }, []);

  return (
    <div>
      Looking for Driver... <Spinner/>
    </div>
  );
};

export default OnTrip;