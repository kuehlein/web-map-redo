// import { Marker } from "google-maps-react";
import React from "react";
import MarkerClusterer from "@google/markerclustererplus";

import { setPointMarkerListeners } from "./showMarkerInfo";
import {
  buildQueryURL,
  clearOverlays,
  getClusterRadius,
  getQueryStringValue
} from "./utils";

// Get the tree data and create markers with corresponding data // ! onwindowload...
export const initMarkers = async (
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
  viewportBounds,
  zoomLevel,
  map,
  maps
) => {
  // TODO: move this somewhere where you set all map properties
  map.setMapTypeId("hybrid");
  // if (req != null) req.abort(); // * can req be a falsy non-null value?

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

  // * new req --- async --- axios/fetch?s
  const initResponse = await fetch(queryUrl);
  const response = await initResponse.json();
  const data = response.data;
  // clear everything // ! should this be set on context?
  points = [];
  markerByPointId = {};
  clearOverlays(markers);
  data.forEach(item => {
    // ! where does data come from?
    const centroid = JSON.parse(item.centroid);
    let latLng = { lat: centroid.coordinates[1], lng: centroid.coordinates[0] };
    let marker;
    if (item.type === "cluster") {
      /* eslint-disable react/jsx-filename-extension */
      marker = new google.maps.Marker({
        // map,
        // label: {
        //   text: item.count.toString(),
        //   color: "white"
        // },
        position: latLng
      });
      // onClick={() => {
      // }}
      // marker.addListener("click", () => {
      //   map.setZoom(zoomLevel + 2);
      //   map.panTo(marker.position);
      // });
    } else if (item.type === "point") {
      latLng = maps.LatLng(item.lat, item.lon);

      marker = (
        <Marker
          position={latLng}
          map={map}
          title="Tree"
          icon={{ url: "../../../../public/assets/media/blank_pin.png" }}
        />
      );

      // set the field for sorting
      item._sort_field = new Date(item.time_created);

      // hold the reference to our points
      points.push(item);
      markerByPointId[item.id] = marker;
    }
    markers.push(marker);
  });
  const markerClusterer = new MarkerClusterer(map, markers, {
    // labelOrigin: maps.Point(...centroid.coordinates)
  });
  markerClusterer.addListener("clusteringend", ev => {
    markerClusterer.addListener("click", cluster => {
      const clusterCenter = cluster.center_;
      const lat = clusterCenter.lat();
      const lng = clusterCenter.lng();
      const map = cluster.map_;
      map.setZoom(zoomLevel + 2);
      map.panTo({lat, lng});
    });
    //   const clusters = ev.clusters_;
    //   clusters.forEach(cluster => {
    //     console.log(cluster)
    //   google.maps.event.addListener(cluster, 'click', console.log)
    //   // cluster.addListener('click', (ev) => console.log(ev))
    // })
  });
  // setPointMarkerListeners(
  //   markerByPointId,
  //   points,
  //   setShouldFetchMarkers,
  //   treeInfoDivShowing
  // );

  // if (firstRender) {
  //   // initialBounds.extend(latLng); // ! which one to use?

  //   if (
  //     data.length > 0 &&
  //     (organization != null || token != null || treeid != null)
  //   ) {
  //     map.fitBounds(initialBounds);
  //     map.setCenter(initialBounds.getCenter());
  //     map.setZoom(map.getZoom() - 1);
  //     if (map.getZoom() > 15) {
  //       map.setZoom(15);
  //     }
  //   }

  //   firstRender = false;
  // }
  // return markers;

  // set he markers once we are done
};
