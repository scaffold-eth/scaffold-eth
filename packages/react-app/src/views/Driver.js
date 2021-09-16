// import { SyncOutlined } from "@ant-design/icons";
// import { utils } from "ethers";
// import { Button, Card, DatePicker, Divider, Input, List, Progress, Slider, Spin, Switch } from "antd";
// import React, { useState } from "react";
// import { Address, Balance } from "../components";

// export default function Driver({
//   purpose,
//   setPurposeEvents,
//   address,
//   mainnetProvider,
//   localProvider,
//   yourLocalBalance,
//   price,
//   tx,
//   readContracts,
//   writeContracts,
// }) {
//   const [licensePlate, setLicensePlate] = useState("loading...");
//   const [latitude, setLatitude] = useState("loading...");
//   const [longitude, setLongitude] = useState("loading...");

//   return (
//     <div>
//       {/*
//         ⚙️ Here is an example UI that displays and sets the purpose in your smart contract:
//       */}
//       <div style={{ border: "1px solid #cccccc", padding: 16, width: 400, margin: "auto", marginTop: 64 }}>
//         <h2>Driver:</h2>
//         <h4>purpose: {purpose}</h4>
//         <Divider />
//         <div style={{ margin: 8 }}>
//           <Input defaultValue="Lat"
//             onChange={e => {
//               setLatitude(e.target.value);
//             }}
//           />
//           <Input defaultValue="Lon"
//             onChange={e => {
//               setLongitude(e.target.value);
//             }}
//           />
//           <Input defaultValue="TSLA"
//             onChange={e => {
//               setLicensePlate(e.target.value);
//             }}
//           />
//           <Button
//             style={{ marginTop: 8 }}
            // onClick={async () => {
            //   /* look how you call setPurpose on your contract: */
            //   /* notice how you pass a call back for tx updates too */
            //   const result = tx(writeContracts.YourContract.driverGoOnline(latitude, longitude, licensePlate), update => {
            //     console.log("📡 Transaction Update:", update);
            //     if (update && (update.status === "confirmed" || update.status === 1)) {
            //       console.log(" 🍾 Transaction " + update.hash + " finished!");
            //       console.log(
            //         " ⛽️ " +
            //         update.gasUsed +
            //         "/" +
            //         (update.gasLimit || update.gas) +
            //         " @ " +
            //         parseFloat(update.gasPrice) / 1000000000 +
            //         " gwei",
            //       );
            //     }
            //   });
            //   console.log("awaiting metamask/web3 confirm result...", result);
            //   console.log(await result);
            // }}
//           >
//             Go Online
//           </Button>
//         </div>

//       </div>


//     </div>
//   );
// }


import './Views.css';
import React, { useState, useRef, useCallback } from 'react'

// Mapbox Imports
import 'mapbox-gl/dist/mapbox-gl.css'
import 'react-map-gl-geocoder/dist/mapbox-gl-geocoder.css'
import ReactMapGL, {GeolocateControl} from 'react-map-gl'

// Base UI imports
import {
  Card,
  StyledAction
} from "baseui/card";

// Components
import Timer from '../components/Timer';
import GoOnline from '../components/GoOnline';
import OnJob from '../components/OnJob';

const MAPBOX_TOKEN = 'ask mike';

const geolocateControlStyle= {
  margin: "3%"
}

export default function Driver({
  purpose,
  setPurposeEvents,
  address,
  mainnetProvider,
  localProvider,
  yourLocalBalance,
  price,
  tx,
  readContracts,
  writeContracts,
}) {

  // State controls
  const [isOnline, setIsOnline] = useState(false)
  const [isRiderFound, setIsRiderFound] = useState(false)

  // Map default view settings 
  const [viewport, setViewport] = useState({
    latitude: 37.7577,
    longitude: -122.4376,
    zoom: 10
  });
  const mapRef = useRef();
  const handleViewportChange = useCallback(
    (newViewport) => setViewport(newViewport),
    []
  );

  // Track state of trip UI
  var state

  if (isOnline && !isRiderFound) {
    state = <Timer onIsRiderFoundChange={setIsRiderFound} onIsOnlineChange={setIsOnline}/>
  }
  else if (isOnline && isRiderFound) {
    state = <OnJob onJobComplete={setIsRiderFound}/>
  }

  else {
    state = <GoOnline isOnline={isOnline} onIsOnlineChange={setIsOnline} tx={tx} writeContracts={writeContracts} />
  }
  

  return (
    <div style={{ height: "100vh" }}>
      <ReactMapGL
        ref={mapRef}
        {...viewport}
        transitionDuration={1000} // Allows for smooth zoom transitions when moving locations
        mapStyle="mapbox://styles/mapbox/streets-v11"
        width="100vw"
        height="100vh"
        onViewportChange={handleViewportChange}
        mapboxApiAccessToken={MAPBOX_TOKEN}
      >
        
        {/* State card */}
        <Card className="card-container">
          <StyledAction>
            {state}
          </StyledAction>
        </Card>

        <GeolocateControl
        style={geolocateControlStyle}
        positionOptions={{enableHighAccuracy: true}}
        trackUserLocation={true}
        auto
      />
      </ReactMapGL>
    </div>
  );
};
