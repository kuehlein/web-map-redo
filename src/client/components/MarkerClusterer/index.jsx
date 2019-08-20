import React from "react";
import PropTypes from "prop-types";
import { MarkerClusterer, Marker } from "@react-google-maps/api";

function selectIcon(type) {
  if (type === "point") {
    return "https://raw.githubusercontent.com/Greenstand/treetracker-web-map/master/client/img/pin_32px.png";
  }
  return "https://raw.githubusercontent.com/Greenstand/treetracker-web-map/master/client/img/cluster_46px.png";
}

function zoomOnClick({ latLng }, map, setCenter) {
  const { lat, lng } = latLng;
  const latitude = lat();
  const longitude = lng();
  const currentZoom = map.getZoom();
  map.setZoom(currentZoom + 2);
  setCenter({ lat: latitude, lng: longitude });
}

export default function MarkerClustererComponent({ markers, map, setCenter }) {
  const clusters = markers && markers.length && markers[0].type === "cluster";
  let icon = "";
  let minClusterSize;
  if (clusters) {
    icon = selectIcon("cluster");
  } else {
    console.log('whats up')
    icon = selectIcon("point");
    minClusterSize = 1;
  }
  console.log(minClusterSize)
  return (
    <MarkerClusterer averageCenter>
      {clusterer =>
        markers.map(({ lat, lng, count, id }) => (
          <Marker
            key={id}
            position={{ lat, lng }}
            clusterer={clusterer}
            animation={google.maps.Animation.DROP}
            title="Tree"
            label={clusters ? String(count) : null}
            icon={icon}
            onClick={event => zoomOnClick(event, map, setCenter)}
          />
        ))
      }
    </MarkerClusterer>
  );
}

MarkerClustererComponent.defaultProps = {
  markers: [],
  map: null,
  setCenter: null
};

MarkerClustererComponent.propTypes = {
  markers: PropTypes.arrayOf(PropTypes.object),
  // eslint-disable-next-line react/forbid-prop-types
  map: PropTypes.object,
  setCenter: PropTypes.func
};
