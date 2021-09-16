import './Views.css';
import React, { useState, useRef, useCallback } from 'react'

// Map Imports
import 'mapbox-gl/dist/mapbox-gl.css'
import 'react-map-gl-geocoder/dist/mapbox-gl-geocoder.css'
import ReactMapGL, {GeolocateControl} from 'react-map-gl'

// Base UI imports
import {
  Card,
  StyledAction
} from "baseui/card";

// Components
import SelectDest from '../components/SelectDest';
import SelectPickUp from '../components/SelectPickUp';
import OnTrip from '../components/OnTrip';
import { Input } from 'baseui/input';

const MAPBOX_TOKEN = '';

const geolocateControlStyle= {
  margin: "3%"
}

function Rider({
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
  const [destination, setDestination] = useState('');
  const [destinationConfirm, setDestinationConfirm] = useState(false);

  const [pickUp, setPickUp] = useState('');
  const [pickUpConfirm, setPickUpConfirm] = useState(false);

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

  if (destinationConfirm && pickUpConfirm) {
    state = <OnTrip pickUp={pickUp} dest={destination}
     tx={tx} writeContracts={writeContracts} RidesEvents={RidesEvents} mainnetProvider={mainnetProvider} 
     localProvider={localProvider}/>
  }
  else if (destinationConfirm && !pickUpConfirm) {
    state = <SelectPickUp onPickUpChange={setPickUp} onPickUpConfirm={setPickUpConfirm} />
  }
  else {
    state = <SelectDest onDestinationChange={setDestination} onDestinationConfirm={setDestinationConfirm} />
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
            {destinationConfirm ? <div> To: <Input disabled value={destination}/> </div> : null}
            {destinationConfirm ? <br/> : null}
            {pickUpConfirm ? <div> From: <Input disabled value={pickUp}/> </div> : null}
            {pickUpConfirm ? <br/>: null}
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

export default Rider;

