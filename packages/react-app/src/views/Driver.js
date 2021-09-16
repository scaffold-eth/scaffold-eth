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

const MAPBOX_TOKEN = '';

const geolocateControlStyle= {
  margin: "3%"
}

export default function Driver({
  RidesEvents,
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
  const [isRiderFound, setIsRiderFound] = useState(null)

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

  if (isOnline && isRiderFound === null) {
    state = <Timer onIsRiderFoundChange={setIsRiderFound} onIsOnlineChange={setIsOnline} RidesEvents={RidesEvents} address={address}/>
  }
  else if (isOnline && isRiderFound !== null) {
    state = <OnJob onJobComplete={setIsRiderFound} rideInfo={rideInfo}/>
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
