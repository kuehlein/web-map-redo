import React from "react";

import "./treeInfo.scss";

// handle the index for a circular list
export const getCircularPointIndex = (index, points) => {
  if (index === points.length) {
    return 0;
  }
  if (index < 0) {
    return points.length - 1;
  }
  return index;
};

function handlePagination(index, value, setInfoWindowData, points) {
  const currentIdx = getCircularPointIndex(index + value, points);
  setInfoWindowData(points[currentIdx]);
}

export default function TreeInfo({
  planterName,
  treeImage,
  planterImage,
  status,
  dateTracked,
  treeId,
  index,
  points,
  setInfoWindowData
}) {
  console.log(
    planterName,
    treeImage,
    planterImage,
    status,
    dateTracked,
    treeId,
    index,
    points,
    setInfoWindowData
  );
  return (
    <section className="overlay_container">
      <div className="overlay">
        <span id="close-button">
          <div className="icon-angle-left" />
        </span>
        <div className="tree_info">
          <img src={treeImage} alt="tree that has been planted" />
          <div className="planter_image">
            <div className="planter_image_wrap">
              <img src={planterImage} alt="person that planted the tree" />
            </div>
          </div>
          <div className="planted_by">
            <p>{planterName}</p>
          </div>
          <p id="status" className="info_data info_data_status">
            The tree has been {status}
          </p>
          <p className="info_data">{}</p>
          <p id="sponsor" className="info_data">
            <span>
              <b>Sponsor</b>
              :&nbsp;
            </span>
          </p>
          <p className="info_data">
            <span>Tracked: </span>
            {dateTracked}
          </p>
          <p id="tree_id_holder" className="info_data">
            <span>Tree Id: </span>
            {treeId}
          </p>
          <br />
          <div className="btn-arrow-container">
            <button
              type="button"
              className="btn-link"
              onClick={() =>
                handlePagination(index, -1, setInfoWindowData, points)
              }
            >
              <img
                src="../../../../public/assets/media/previous_tree.svg"
                alt="previous arrow"
              />
            </button>
            <button
              type="button"
              className="btn-link"
              onClick={() =>
                handlePagination(index, 1, setInfoWindowData, points)
              }
            >
              <img
                src="../../../../public/assets/media/next_tree.svg"
                alt="next arrow"
              />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
