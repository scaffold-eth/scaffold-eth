import React, { useEffect, useState } from 'react';

import Geocode from "react-geocode";

import { Spinner } from "baseui/spinner";

Geocode.setApiKey("ask mike");


// OnTrip Step
function OnTrip({pickUp, dest}) {
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



  }, []);

  return (
    <div>
      Looking for Driver... <Spinner/>
    </div>
  );
};

export default OnTrip;