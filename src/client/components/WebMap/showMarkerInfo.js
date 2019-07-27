import $ from "jquery";

// using an index, get the point and marker and show them
const showMarkerInfoByIndex = (index, markerByPointId, points) => {
  const point = points[index];
  const marker = markerByPointId[point.id];
  showMarkerInfo(point, marker, index);
};

// set up and show the marker info
const showMarkerInfo = (points, point, marker, markerByPointId, index) => {
  const YES = "YES";
  const NO = "NO";

  $("#tree_info_div").show("slide", "swing", 600);
  if (treeInfoDivShowing == false) {
    treeInfoDivShowing = true;
    $("#map-canvas").animate(
      {
        margin: "0 0 0 295px"
      },
      700,
      () => {
        // Animation Complete
      }
    );
  }
  // always center this one
  map.panTo(marker.getPosition());

  $("#create-data").html(point.time_created);
  $("#updated-data").html(point.time_updated);
  $("#gps-accuracy-data").html(point.gps_accuracy);
  $("#latitude-data").html(point.lat);
  $("#longitude-data").html(point.lon);
  if (point.missing) {
    $("#missing-data").html(YES);
  } else {
    $("#missing-data").html(NO);
  }
  if (point.dead) {
    $("#dead-data").html(YES);
  } else {
    $("#dead-data").html(NO);
  }
  $("#tree-image").attr("src", point.image_url);
  $("#planter_name").html(`${point.first_name} ${point.last_name.slice(0, 1)}`);
  if (point.user_image_url) {
    $("#planter_image").attr("src", point.user_image_url);
  } else {
    $("#planter_image").attr("src", "img/portrait_placeholder_100.png");
  }
  $("#tree_next").val(getCircularPointIndex(index + 1, points));
  $("#tree_prev").val(getCircularPointIndex(index - 1, points));

  $("#tree_next")
    .off("click")
    .on("click", () => {
      fetchMarkers = false;
      const index = parseInt($(this).val(), 10);
      showMarkerInfoByIndex(index, markerByPointId, points);
    });

  $("#tree_prev")
    .off("click")
    .on("click", () => {
      fetchMarkers = false;
      const index = parseInt($(this).val(), 10);
      showMarkerInfoByIndex(index, markerByPointId, points);
    });
};

export const setPointMarkerListeners = (markerByPointId, points) => {
  points.sort((a, b) => a._sort_field - b._sort_field);

  $.each(points, (i, point) => {
    const marker = markerByPointId[point.id];
    google.maps.event.addListener(marker, "click", () => {
      showMarkerInfo(points, point, marker, markerByPointId, i);
    });
  });
};
