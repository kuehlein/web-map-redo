import { GoogleApiWrapper, InfoWindow, Map, Marker } from "google-maps-react";
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

//   // const theZoomIs = map.getZoom() - 1; // ? <----------
//   // if (map.getZoom() > 15) {
//   //   map.setZoom(15);
//   // }

const WebMap = props => {
  const { google } = props;
  const markerByPointId = {};
  const token = getQueryStringValue("token") || null;
  const organization = getQueryStringValue("organization") || null;
  const treeid = getQueryStringValue("treeid") || null;
  const donor = getQueryStringValue("donor") || null;
  const points = [
    // ! grab from server --- temporary...
    { lat: 42.02, lng: -77.01 },
    { lat: 42.03, lng: -77.02 },
    { lat: 41.03, lng: -77.04 },
    { lat: 42.05, lng: -77.02 }
  ];

  // ??????????????????
  const firstRender = true;
  const treeInfoDivShowing = false;

  const linkZoom = parseInt(getQueryStringValue("zoom"), 10);
  const initialZoom = [token, organization, treeid, donor].some(
    val => val != null
  )
    ? 10
    : linkZoom || 6; // ! i dont like this

  const [currentZoom, setCurrentZoom] = useState(initialZoom);
  const [shouldFetchMarkers, setShouldFetchMarkers] = useState(true);
  const [markers, setMarkers] = useState([]);
  // ! ??? context ???

  // const map = new google.maps.Map(
  //   document.getElementById("map-canvas").firstChild,
  //   {
  //     fullscreenControl: false,
  //     mapTypeControl: false,
  //     mapTypeId: "hybrid",
  //     minZoom: 6,
  //     streetViewControl: false,
  //     zoom
  //   }
  // );

  // ! -------------------------------------------------------------------------
  // ! -------------------------------------------------------------------------
  // ! -------------------------------------------------------------------------

  async function handleOnReady(mapProps, map, state, hooks) {
    const { setShouldFetchMarkers, setCurrentZoom, setMarkers } = hooks;
    const { shouldFetchMarkers, currentZoom } = state;
    const {
      google: { maps }
    } = mapProps;

    const initialBounds = maps.LatLngBounds();

    map.addListener("dragstart", () => {
      console.log("does this happen");
      setShouldFetchMarkers(true);
    });
    map.addListener("zoom_changed", () => {
      console.log("is zoom changed working");
      setShouldFetchMarkers(true);
    });

    map.addListener("idle", async () => {
      const zoomLevel = map.getZoom();
      console.log(`New zoom level: ${zoomLevel}`);
      setCurrentZoom(zoomLevel);

      console.log("\n\n\nmap", map.getBounds, "\n\n\n"); // ! getBounds is a function, but returns null...

      // no need to load this up at every tiny movement
      if (shouldFetchMarkers) {
        setMarkers(await initMarkers(
          currentZoom,
          firstRender,
          initialBounds,
          markerByPointId,
          markers,
          organization,
          points,
          setShouldFetchMarkers,
          token,
          treeid,
          treeInfoDivShowing,
          toUrlValueLonLat(getViewportBounds(map, 1.1)), // ! <---
          zoomLevel,
          map,
          maps
        ));
      }
    });
  }

  // ! -------------------------------------------------------------------------
  // ! -------------------------------------------------------------------------
  // ! -------------------------------------------------------------------------

  // ! not sure i want to do like this...

  // only fetch when the user has made some sort of action
  // useEffect(() => {
  //   // ! figure out a better way to handle this... vvv
  //   const map = new google.maps.Map(
  //     document.getElementById("map-canvas").firstChild,
  //     {
  //       fullscreenControl: false,
  //       mapTypeControl: false,
  //       mapTypeId: "hybrid",
  //       minZoom: 6,
  //       streetViewControl: false,
  //       zoom
  //     }
  //   );

  // }, [setCurrentZoom]);

  // setCurrentZoom(initialZoom); // currentZoom = initialZoom;
  // map.setCenter({ lat: -3.33313276473463, lng: 37.142856230615735 });

  // $("#close-button").click(() => {
  //   $("#tree_info_div").hide("slide", "swing", 600);
  //   treeInfoDivShowing = false;
  //   $("#map-canvas").css("margin-left", "0px");
  // });

  // ! -------------------------------------------------------------------------

  // const bounds = new google.maps.LatLngBounds();
  // for (let i = 0; i < points.length; i++) {
  //   bounds.extend(points[i]);
  // }

  // ! ----------------------* stuff from tutorial *----------------------------
  const [activeMarker, setActiveMarker] = useState({}); // Shows the active marker upon click
  const [selectedPlace, setSelectedPlace] = useState({}); // Shows the infoWindow to the selected place upon a marker
  const [showingInfoWindow, setShowingInfoWindow] = useState(false); // Hides or the shows the infoWindow

  const onMarkerClick = (marker, props) => {
    // setActiveMarker(marker);
    // setSelectedPlace(props);
    // setShowingInfoWindow(true);
  };

  const onClose = () => {
    // if (showingInfoWindow) {
    //   setShowingInfoWindow(false);
    //   setActiveMarker(null);
    // }
  };
  // ! ----------------------* stuff from tutorial *----------------------------

  return (
    <div style={{ height: "100%", width: "100%" }}>
      {/* <div id="overlay" className="overlay_container">
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
                <b>Status</b>:{" "}
              </span>
              <span id="status-data">Planted</span>
            </p>
            <p id="sponsor" className="info_data">
              <span>
                <b>Sponsor</b>:{" "}
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
      </div> */}

      {/* // ! this is a pretty trashy way of doing this... */}
      <div id="map-grand-parent">
        <div id="map-canvas">
          <Map
            google={google} // ? --------------------------------
            // initialCenter={initialCenter}
            style={{
              width: "100%",
              height: "100%"
            }}
            zoom={2}
            onReady={(mapProps, map) =>
              handleOnReady(
                mapProps,
                map,
                { shouldFetchMarkers, currentZoom },
                { setShouldFetchMarkers, setCurrentZoom, setMarkers }
              )
            }

            //       center={bounds.getCenter()}

            // ! these were on original map, don't seem to be in lib
            //       // minZoom={6}
            //       // mapTypeId="hybrid"
            //       // mapTypeControl={false}
            //       // streetViewControl={false}
            //       // fullscreenControl={false}
          >
            {markers}
            {/* <InfoWindow
              marker={activeMarker}
              visible={showingInfoWindow}
              onClose={onClose}
            >
              <div>
                <h4>{selectedPlace.name}</h4>
              </div>
            </InfoWindow> */}
          </Map>
        </div>
      </div>

      {/* <div id="map-loader" className="page-loader active">
        <div className="loader" />
      </div> */}
    </div>
  );
};

export default GoogleApiWrapper(({ zoom }) => ({
  // ! this thing pass˝es `google` as props
  apiKey: "AIzaSyBLHZL7-3Y5aNMlW_Cz5G1NyBn5R0Mmurs",
  initialCenter: {
    lat: -3.33313276473463,
    lng: 37.142856230615735
  },
  zoom
}))(WebMap);

// export default GoogleApiWrapper(({ apiKey }) => ({
//   apiKey
// })(WebMap)

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
