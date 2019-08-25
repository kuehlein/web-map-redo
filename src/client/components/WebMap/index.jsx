import React, { useState, useCallback, useEffect } from "react";
// import PropTypes from "prop-types";
import { GoogleMap, useLoadScript } from "@react-google-maps/api";

import MarkerClusterer from "../MarkerClusterer";
import createMarkers from "./createMarkers";

import './webMap.module.scss';

function getCurrentCenterOfMap(map) {
  // Only during the initial render when the map has not yet loaded
  if (!map) {
    return {
      lat: -3.33313276473463,
      lng: 37.142856230615735
    };
  }
  // When zooming in, this calculates where the user is zooming
  // from (where they are clicking) and zooms directly towards
  // that point.
  return {
    lat: map.getCenter().lat(),
    lng: map.getCenter().lng()
  };
}

async function handleMapMovement(map, setMarkers) {
  if (map) {
    const zoomLevel = map.getZoom();
    const markers = await createMarkers(zoomLevel, map);
    setMarkers(markers);
  }
}

const WebMap = ({ setShowInfoWindow, setInfoWindowData, setPoints }) => {
  // Set main state of component
  const [markers, setMarkers] = useState([]);
  const [map, setMap] = useState(null);
  const [center, setCenter] = useState(getCurrentCenterOfMap(map));

  // This handles the first render when the map is not fully loaded, allowing
  // the query to get the markers to run asynchronously.
  useEffect(() => {
    async function fetchInitialMarkers() {
      const DEFAULT_ZOOM_LEVEL = 2;
      const initMarkers = await createMarkers(DEFAULT_ZOOM_LEVEL, map);
      setMarkers(initMarkers);
    }
    fetchInitialMarkers();
  }, []);

  // This initially loads the map
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: "AIzaSyBLHZL7-3Y5aNMlW_Cz5G1NyBn5R0Mmurs"
  });

  // Callback for when the map loads
  const onLoad = useCallback(function onLoad(mapInstance) {
    setMap(mapInstance);
  });

  const renderMap = () => {
    return (
      <GoogleMap
        id="google-map"
        center={center}
        onLoad={onLoad}
        zoom={2}
        mapTypeId="hybrid"
        onDragEnd={() => handleMapMovement(map, setMarkers)}
        onZoomChanged={() => handleMapMovement(map, setMarkers)}
      >
        <MarkerClusterer
          {...{ markers, map, setCenter, setShowInfoWindow, setInfoWindowData, setPoints }}
        />
      </GoogleMap>
    );
  };

  if (loadError) {
    return <div>The map cannot be loaded right now.</div>;
  }

  return isLoaded && renderMap();
};

export default WebMap;
