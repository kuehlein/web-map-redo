import React from "react";
import PropTypes from "prop-types";
import { MarkerClusterer, Marker } from "@react-google-maps/api";

import './markerClusterer.module.scss';

function selectIcon(type) {
  if (type === "point") {
    return "https://raw.githubusercontent.com/Greenstand/treetracker-web-map/master/client/img/pin_32px.png";
  }
  return "https://raw.githubusercontent.com/Greenstand/treetracker-web-map/master/client/img/cluster_46px.png";
}

function zoomOnClick({ latLng: { lat, lng } }, map, setCenter) {
  const latitude = lat();
  const longitude = lng();
  const currentZoom = map.getZoom();
  map.setZoom(currentZoom + 2);
  setCenter({ lat: latitude, lng: longitude });
}

export default function MarkerClustererComponent({
  markers,
  map,
  setCenter,
  setShowInfoWindow,
  setInfoWindowData
}) {
  console.log(markers);
  const clusters = markers && markers.length && markers[0].type === "cluster";
  let icon = "";
  if (clusters) {
    icon = selectIcon("cluster");
  } else {
    icon = selectIcon("point");
  }
  return (
    <MarkerClusterer averageCenter minimumClusterSize={Infinity}>
      {clusterer =>
        markers.map(
          ({
            lat,
            lng,
            count,
            id,
            type,
            planterName,
            treeImage,
            planterImage,
            status,
            dateTracked
          }) => (
            <Marker
              className="test"
              key={id}
              position={{ lat, lng }}
              clusterer={clusterer}
              title="Tree"
              label={clusters ? String(count) : null}
              icon={icon}
              onClick={event => {
                console.log(type)
                if (type === "cluster") {
                  zoomOnClick(event, map, setCenter);
                } else {
                  setInfoWindowData({
                    planterName,
                    treeImage,
                    planterImage,
                    status,
                    dateTracked,
                    treeId: id
                  });
                  setShowInfoWindow(true);
                }
              }}
            />
          )
        )
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
