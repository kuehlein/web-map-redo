import { Marker } from "google-maps-react";
import $ from "jquery";
import React from "react";

import { setPointMarkerListeners } from "./showMarkerInfo";
import {
  buildQueryURL,
  clearOverlays,
  getClusterRadius,
  getQueryStringValue
} from "./utils";

// ! fuck dude this is nuts
// Get the tree data and create markers with corresponding data // ! onwindowload...
export const initMarkers = (
  currentZoom,
  firstRender,
  initialBounds,
  markerByPointId,
  markers,
  organization,
  points,
  req = null,
  setShouldFetchMarkers,
  token,
  treeid,
  treeInfoDivShowing,
  viewportBounds,
  zoomLevel
) => {
  if (req != null) req.abort(); // * can req be a falsy non-null value?

  const clusterRadius =
    getQueryStringValue("clusterRadius") || getClusterRadius(zoomLevel);

  const queryUrl = buildQueryURL(
    clusterRadius,
    currentZoom,
    firstRender,
    organization,
    token,
    treeid,
    viewportBounds,
    zoomLevel
  );

  // * new req --- async --- axios/fetch?
  return $.get(queryUrl, data => {
    // clear everything // ! should this be set on context?
    points = [];
    markerByPointId = {};
    clearOverlays(markers);

    data.forEach(item => {
      // ! where does data come from?
      if (item.type === "cluster") {
        const centroid = JSON.parse(item.centroid);
        const latLng = new google.maps.LatLng(
          centroid.coordinates[1],
          centroid.coordinates[0]
        );

        /* eslint-disable react/jsx-filename-extension */
        const marker = (
          <Marker
            position={latLng}
            // map={map}
            label={{
              text: item.count.toString(),
              color: "#fff"
            }}
            icon={{
              url: "./img/blank_pin.png",
              labelOrigin: new google.maps.Point(20, 22)
            }}
          />
        );

        google.maps.event.addListener(marker, "click", () => {
          const zoomLevel = map.getZoom();
          map.setZoom(zoomLevel + 2);
          map.panTo(marker.position);
        });
      } else if (item.type === "point") {
        const latLng = new google.maps.LatLng(item.lat, item.lon);

        const marker = (
          <Marker
            position={latLng}
            map={map}
            title="Tree"
            icon={{ url: "./img/blank_pin.png" }}
          />
        );

        // set the field for sorting
        item._sort_field = new Date(item.time_created);

        // hold the reference to our points
        points.push(item);
        markerByPointId[item.id] = marker;
        markers.push(marker);
      }

      // set he markers once we are done
      setPointMarkerListeners(
        markerByPointId,
        points,
        setShouldFetchMarkers,
        treeInfoDivShowing
      );

      if (firstRender) {
        initialBounds.extend(latLng); // ! which one to use?

        if (
          data.data.length > 0 &&
          (organization != null || token != null || treeid != null)
        ) {
          map.fitBounds(initialBounds);
          map.setCenter(initialBounds.getCenter());
          map.setZoom(map.getZoom() - 1);
          if (map.getZoom() > 15) {
            map.setZoom(15);
          }
        }

        firstRender = false;
      }
    });
  });
};
