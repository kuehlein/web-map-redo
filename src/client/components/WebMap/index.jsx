import { GoogleApiWrapper, Map, Marker } from "google-maps-react";
import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import $ from "jquery";

import { initMarkers } from "./initMarkers";
import {
  getQueryStringValue,
  getViewportBounds,
  toUrlValueLonLat
} from "./utils";

// ! -----
// * what to do about `google` and `maps`?
// ! -----

export const MapContainer = ({ center, google, initialCenter }) => {
  // ! context...
  const markerByPointId = {};
  const token = getQueryStringValue("token") || null;
  const organization = getQueryStringValue("organization") || null;
  const treeid = getQueryStringValue("treeid") || null;
  const donor = getQueryStringValue("donor") || null;
  const points = [
    // ! grab from server
    // { lat: 42.02, lng: -77.01 },
    // { lat: 42.03, lng: -77.02 },
    // { lat: 41.03, lng: -77.04 },
    // { lat: 42.05, lng: -77.02 }
  ];
  const markers = []; // ! ???

  // ??????????????????
  const firstRender = true;
  let treeInfoDivShowing = false;

  let req = null;
  const initialBounds = new google.maps.LatLngBounds(); // ! how to replace
  const linkZoom = parseInt(getQueryStringValue("zoom"), 10);
  const initialZoom = [token, organization, treeid, donor].some(
    val => val != null
  )
    ? 10
    : linkZoom || 6; // ! i dont like this

  // ! not sure i want to do like this...
  const [currentZoom, setCurrentZoom] = useState(initialZoom);
  const [shouldFetchMarkers, setShouldFetchMarkers] = useState(true);

  // const onMarkerClick = () => {}; // * optional func for markers

  useEffect(() => {
    google.maps.event.addListener(map, "dragstart", () => {
      setShouldFetchMarkers(true);
    });
    google.maps.event.addListener(map, "zoom_changed", () => {
      setShouldFetchMarkers(true);
    });
  });

  // only fetch when the user has made some sort of action
  useEffect(() => {
    google.maps.event.addListener(map, "idle", () => {
      const zoomLevel = map.getZoom();
      console.log(`New zoom level: ${zoomLevel}`);
      setCurrentZoom(zoomLevel);

      // no need to load this up at every tiny movement
      if (shouldFetchMarkers) {
        req = initMarkers(
          currentZoom,
          firstRender,
          initialBounds,
          markerByPointId,
          markers,
          organization,
          points,
          req,
          setShouldFetchMarkers,
          token,
          treeid,
          treeInfoDivShowing,
          toUrlValueLonLat(getViewportBounds(1.1)),
          zoomLevel
        );
      }
    });
  }, [setCurrentZoom]);

  // currentZoom = initialZoom;
  map.setCenter({ lat: -3.33313276473463, lng: 37.142856230615735 });

  $("#close-button").click(() => {
    $("#tree_info_div").hide("slide", "swing", 600);
    treeInfoDivShowing = false;
    $("#map-canvas").css("margin-left", "0px");
  });

  // ! -------------------------------------------------------------------------

  const bounds = new google.maps.LatLngBounds();
  for (let i = 0; i < points.length; i++) {
    bounds.extend(points[i]);
  }

  // const theZoomIs = map.getZoom() - 1; // ? <----------
  // if (map.getZoom() > 15) {
  //   map.setZoom(15);
  // }

  return (
    <Map
      bounds={bounds} // ! ----------
      center={bounds.getCenter()}
      google={google} // ? ---------------------
      zoom={initialZoom}

      // ! these were on original map, don't seem to be in lib
      // minZoom={6}
      // mapTypeId="hybrid"
      // mapTypeControl={false}
      // streetViewControl={false}
      // fullscreenControl={false}
    >
      {/* <Marker onClick={onMarkerClick} name="Current location" /> */}
    </Map>
  );
};

export default GoogleApiWrapper({
  apiKey: "AIzaSyBLHZL7-3Y5aNMlW_Cz5G1NyBn5R0Mmurs"
})(MapContainer);

/**
 * Main thing...
 */
const WebMap = ({ center, zoom }) => {
  return (
    <div style={{ height: "100%", width: "100%" }}>
      <div id="overlay" className="overlay_container">
        <div id="tree_info_div" className="overlay_innards">
          <span id="close-button">
            <div className="icon-angle-left" />
          </span>
          <div className="tree_info">
            <img alt="..." id="tree-image" src="" />
            <div className="planter_image">
              <div className="planter_image_wrap">
                <img
                  alt="planter"
                  id="planter_image"
                  src="/public/assets/media/portrait_placeholder_100.png"
                />
              </div>
            </div>

            <div className="planted_by">
              <p>
                <span>Planter: </span>
                <span id="planter_name">Planter</span>
              </p>
            </div>

            <p id="status" className="info_data info_data_status success">
              <span>
                <b>Status</b>
:
                {" "}
              </span>
              <span id="status-data">Planted</span>
            </p>
            <p id="sponsor" className="info_data">
              <span>
                <b>Sponsor</b>
:
                {" "}
              </span>
              <span id="status-data" />
            </p>
            <p id="created_on" className="info_data">
              <span>Tracked: </span>
              <span id="create-data" />
            </p>

            <br />

            <div className="float-left info_data">
              <a href="#" className="float-left tree_nav" id="tree_prev">
                <img
                  alt="..."
                  src="/public/assets/media/webmap-back-green.svg"
                  style={{ width: "30px" }}
                />
              </a>
              <a href="#" className="float-right tree_nav" id="tree_next">
                <img
                  alt="..."
                  src="/public/assets/media/webmap-forward-green.svg"
                  style={{ width: "30px" }}
                />
              </a>
            </div>
          </div>
        </div>
      </div>

      <GoogleMapReact
        apiKey="AIzaSyBLHZL7-3Y5aNMlW_Cz5G1NyBn5R0Mmurs" // ?
        // bootstrapURLKeys={{
        //   key: "AIzaSyAyesbQMyKVVbBgKVi2g6VX7mop2z96jBo" // ?
        // }}
        defaultCenter={center}
        defaultZoom={zoom}
      >
        {/* children appear on the map */}
      </GoogleMapReact>

      <div id="map-loader" className="page-loader active">
        <div className="loader" />
      </div>
    </div>
  );
};

// export default WebMap;

/**
 * *---------------------------------------------------------------------------*
 * *-----------------------------* Prop Types *--------------------------------*
 * *---------------------------------------------------------------------------*
 */

WebMap.propTypes = {
  center: PropTypes.shape({
    lat: PropTypes.number,
    lng: PropTypes.number
  }),
  zoom: PropTypes.number
};

WebMap.defaultProps = {
  center: {
    lat: -3.33313276473463,
    lng: 37.142856230615735
  },
  zoom: 10
};
