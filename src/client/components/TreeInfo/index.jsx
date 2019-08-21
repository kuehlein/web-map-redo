import React from "react";

import './treeInfo.scss';

export default function TreeInfo({
  planterName,
  treeImage,
  planterImage,
  status,
  dateTracked,
  treeId
}) {
  console.log('do we get here?')
  return (
    <section className="overlay_container test"> {/* // !--- */}
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
          <div className="float-left info_data">
            <a href="#" className="float-left tree_nav" id="tree_prev">
              <img src="img/previous_tree.svg" />
            </a>
            <a href="#" className="float-right tree_nav" id="tree_next">
              <img src="img/next_tree.svg" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
