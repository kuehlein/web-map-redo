import startCase from "lodash/startCase";

import {
  buildQueryURL,
  getClusterRadius,
  getQueryStringValue,
  getViewportBounds,
  toUrlValueLonLat
} from "./utils";

// Prevention of repetition
function getLatLng({ coordinates }) {
  const [lng, lat] = coordinates;
  return { lat, lng };
}

function createQueryString(zoomLevel, map) {
  let viewportBounds = "";
  let clusterRadius = "";
  if (map) {
    viewportBounds = toUrlValueLonLat(getViewportBounds(map, 1.1));
    clusterRadius =
      getQueryStringValue("clusterRadius") || getClusterRadius(zoomLevel);
  }

  const token = getQueryStringValue("token") || null;
  const organization = getQueryStringValue("organization") || null;
  const treeid = getQueryStringValue("treeid") || null;
  const queryUrl = buildQueryURL(
    clusterRadius,
    zoomLevel,
    organization,
    token,
    treeid,
    viewportBounds
  );
  return queryUrl;
}

function getClusters(clusters) {
  return clusters.map(cluster => {
    const latLng = getLatLng(JSON.parse(cluster.centroid));
    const { count, id } = cluster;
    const clusterData = Object.assign(latLng, { count, id, type: "cluster" });
    return clusterData;
  });
}

/**
 * A point: 
 * active: true
    approved: true
    cause_of_death_id: null
    certificate_id: 73
    cluster_regions_assigned: true
    dead: 0
    device_id: 323
    estimated_geometric_location: "0101000020E61000009BCE4E0647C9C7BFD89942E735961640"
    first_name: "Anonymous"
    gps_accuracy: 4
    id: 136460
    image_url: "https://treetracker-production.nyc3.digitaloceanspaces.com/2019.07.12.07.23.16_ac443c80-ab4f-417d-b566-954f68b91edb_IMG_20190712_063154_-1342457069.jpg"
    last_name: "Planter1150"
    lat: "5.6466899999999995"
    lon: "-0.18583000000000002"
    missing: false
    note: "herb"
    override_settings_id: null
    photo_id: null
    planter_identifier: "sarahaddae34@gmail.com"
    planter_photo_url: "https://treetracker-production.nyc3.digitaloceanspaces.com/2019.07.12.07.19.12_dede5a89-89f1-403c-aae8-ee393d897199_IMG_20190712_060413_1457328444.jpg"
    primary_location_id: null
    priority: false
    sequence: 374
    settings_id: null
    status: "planted"
    time_created: "2019-08-11T10:32:04.000Z"
    time_updated: "2019-08-11T10:32:04.000Z"
    type: "point"
    user_id: 1150
    user_image_url: "https://treetracker-production.nyc3.digitaloceanspaces.com/2019.07.08.18.34.06_3aa3b53f-7d1a-4168-b60b-3f209c011218_IMG_20190708_175750_-1704729297.jpg"
    uuid: "88f5975a-2125-4c99-beef-fe78dbc687b4"
    verified: false
 */
function getPoints(points) {
  return points.map((point, index) => {
    const { lat, lon, id } = point;
    const planterName = `${point.first_name} ${point.last_name[0]}`;
    const treeImage = point.image_url;
    let planterImage = point.user_image_url || point.planter_photo_url;
    if (!planterImage) {
      planterImage =
        "../../../../public/assets/media/portrait_placeholder_100.png";
    }
    const status = startCase(point.status);
    const dateTracked = new Date(point.time_updated).toDateString().slice(4);

    const pointData = {
      id,
      lat: Number(lat),
      lng: Number(lon),
      type: "point",
      planterName,
      treeImage,
      planterImage,
      status,
      dateTracked,
      index
    };
    return pointData;
  });
}

const createMarkers = async (zoomLevel, map) => {
  // Create query url
  const queryUrl = createQueryString(zoomLevel, map);
  console.log(queryUrl);

  // Query
  let initResponse;
  try {
    initResponse = await fetch(queryUrl);
  } catch (error) {
    // This should never happen
    console.log(error);
  }
  const response = await initResponse.json();
  const { data } = response;

  if (data && data.length > 0) {
    console.log(data);
    const clusters = data[0].type === "cluster";
    let markers = [];
    if (clusters) {
      markers = getClusters(data);
    } else {
      markers = getPoints(data);
    }
    return markers;
  }
  return [];
};

export default createMarkers;
