// * import from config --- CONSTANT
const treetrackerApiUrl =
  "http://localhost:9000/api/" || "http://dev.treetracker.org/api/";

export const getClusterRadius = zoom =>
  ({
    1: 10,
    2: 8,
    3: 6,
    4: 4,
    5: 0.8,
    6: 0.75,
    7: 0.3,
    8: 0.099,
    9: 0.095,
    10: 0.05,
    11: 0.03,
    12: 0.02,
    13: 0.008,
    14: 0.005,
    15: 0.004,
    16: 0.003,
    17: 0.0,
    18: 0.0,
    19: 0.0
  }[zoom] || 0);

// handle the index for a circular list
export const getCircularPointIndex = (index, points) => {
  if (index > points.length - 1) {
    index = 0;
  } else if (index < 0) {
    index = points.length - 1;
  }
  return index;
};

export const getQueryStringValue = (name, url) => {
  let newUrl;
  if (!url) newUrl = window.location.href;
  const newName = name.replace(/[[\]]/g, "\\$&");

  const regex = new RegExp(`[?&]${newName}(=([^&#]*)|&|#|$)`);
  const results = regex.exec(newUrl);

  if (!results) return null;
  if (!results[2]) return "";
  return decodeURIComponent(results[2].replace(/\+/g, " "));
};

export const toUrlValueLonLat = bounds => {
  const east = bounds.getNorthEast().lng();
  const west = bounds.getSouthWest().lng();
  const north = bounds.getNorthEast().lat();
  const south = bounds.getSouthWest().lat();
  return [east, north, west, south].join();
};

// Returns the bounds for the visible area of the map.
// The offset parameter extends the bounds resulting rectangle by a certain percentage.
// For example: 1.1 will return a rectangle with each point (N, S, E, W) 10% farther from the rectangle.
// The offset specification might be useful for preloading trees around the visible area, taking advantage of a single request.
export const getViewportBounds = (map, offset) => {
  const bounds = map.getBounds();

  if (offset) {
    const decreasedOffset = offset - 1;
    const east = bounds.getNorthEast().lng();
    const west = bounds.getSouthWest().lng();
    const north = bounds.getNorthEast().lat();
    const south = bounds.getSouthWest().lat();

    // Get the longitude and latitude differences
    const longitudeDifference = (east - west) * decreasedOffset;
    const latitudeDifference = (north - south) * decreasedOffset;

    // Move each point farther outside the rectangle
    // To west
    bounds.extend(new google.maps.LatLng(south, west - longitudeDifference));
    // To east
    bounds.extend(new google.maps.LatLng(north, east + longitudeDifference));
    // To south
    bounds.extend(new google.maps.LatLng(south - latitudeDifference, west));
    // To north
    bounds.extend(new google.maps.LatLng(north + latitudeDifference, east));
  }
  return bounds;
};

export const buildQueryURL = (
  clusterRadius,
  zoomLevel,
  organization,
  token,
  treeid,
  viewportBounds
) => {
  let queryUrl = `${treetrackerApiUrl}trees?clusterRadius=${clusterRadius}&zoom_level=${zoomLevel}`;

  switch (true) {
    case zoomLevel >= 4 &&
      ![token, organization, treeid].some(val => val != null):
    queryUrl = `${queryUrl}&bounds=${viewportBounds}`;
    /* eslint-disable-next-line no-fallthrough */
    case token != null:
      // queryUrl = `${queryUrl}&token=${token}`;
      break;
    case organization != null:
      queryUrl = `${queryUrl}&organization=${organization}`;
      break;
    case treeid != null:
      queryUrl = `${queryUrl}&treeid=${treeid}`;
      break;
    default:
      break;
  }
  return queryUrl;
};
