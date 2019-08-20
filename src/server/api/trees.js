/* eslint-disable */
const router = require("express").Router();

const { Pool } = require("pg");

const secrets = require("../../secrets");

const pool = new Pool({ connectionString: secrets.connectionString });

router.get("/trees", function(req, res) {
  let token = req.query["token"];
  let organization = req.query["organization"];
  let flavor = req.query["flavor"];
  let treeid = req.query["treeid"];
  let userid = req.query["userid"];
  let join = "";
  let joinCriteria = "";
  let filter = "";
  let subset = false;
  if (token) {
    join =
      "INNER JOIN certificates ON trees.certificate_id = certificates.id AND certificates.token = '" +
      token +
      "'";
    subset = true;
  } else if (organization) {
    join = `JOIN certificates ON trees.certificate_id = certificates.id 
             JOIN donors ON certificates.donor_id = donors.id
             JOIN organizations ON donors.organization_id = organizations.id`;
    joinCriteria = "AND organizations.id = " + organization;
    subset = true;
  } else if (flavor) {
    join = "INNER JOIN tree_attributes ON tree_attributes.tree_id = trees.id";
    joinCriteria =
      "AND tree_attributes.key = 'app_flavor' AND tree_attributes.value = '" +
      flavor +
      "'";
    subset = true;
  } else if (treeid) {
    filter = "AND trees.id = " + treeid + " ";
    subset = true;
  } else if (userid) {
    filter = "AND trees.user_id = " + userid + " ";
    subset = true;
  }

  let bounds = req.query["bounds"];
  let boundingBoxQuery = "";
  let clusterBoundingBoxQuery = "";
  if (bounds) {
    boundingBoxQuery =
      "AND trees.estimated_geometric_location && ST_MakeEnvelope(" +
      bounds +
      ", 4326) ";
    clusterBoundingBoxQuery =
      "AND location && ST_MakeEnvelope(" + bounds + ", 4326) ";
  }

  let clusterRadius = parseFloat(req.query["clusterRadius"]);
  var sql, query;
  const zoomLevel = req.query["zoom_level"];
  if (parseInt(zoomLevel) > 15 || treeid != null) {
    sql =
      `SELECT DISTINCT ON(trees.id)
    'point' AS type,
     trees.*, users.first_name as first_name, users.last_name as last_name,
    users.image_url as user_image_url
    FROM trees ` +
      join +
      `
    INNER JOIN users
    ON users.id = trees.user_id 
    LEFT JOIN note_trees
    ON note_trees.tree_id = trees.id
    LEFT JOIN notes
    ON notes.id = note_trees.note_id
    WHERE active = true ` +
      boundingBoxQuery +
      filter +
      joinCriteria;

    query = {
      text: sql
    };
  } else if (subset) {
    sql =
      `SELECT 'cluster'                                           AS type,
       St_asgeojson(St_centroid(clustered_locations))                 centroid,
       St_numgeometries(clustered_locations)                          count
      FROM   (
       SELECT Unnest(St_clusterwithin(estimated_geometric_location, $1)) clustered_locations
       FROM   trees ` +
      join +
      `
       WHERE  active = true ` +
      boundingBoxQuery +
      filter +
      joinCriteria +
      ` ) clusters`;
    query = {
      text: sql,
      values: [clusterRadius]
    };
  } else if (["12", "13", "14", "15"].includes(zoomLevel)) {
    console.log(
      "Using cluster cache from zoom level 14  for zoom level " + zoomLevel
    );
    sql = `SELECT 'cluster' as type,
           St_asgeojson(location) centroid, count
           FROM clusters
           WHERE zoom_level = 14 ${clusterBoundingBoxQuery}`;
    query = {
      text: sql
    };
  } else {
    // check if query is in the cached zone
    var boundingBox;
    if (bounds) {
      boundingBox = bounds.split(",");
    }

    var regionBoundingBoxQuery = "";

    if (zoomLevel >= 10) {
      console.log("greater eq 10");

      if (bounds) {
        regionBoundingBoxQuery =
          " AND geom && ST_MakeEnvelope(" + bounds + ", 4326) ";
      }

      query = {
        text: `SELECT 'cluster' AS type,
			  region.id, ST_ASGeoJson(region.centroid) centroid,
                 region.type_id as region_type,
                 count(tree_region.id)
                 FROM tree_region
                 JOIN trees
                 ON trees.id = tree_region.tree_id
                 AND trees.active = TRUE
                 JOIN region
                 ON region.id = region_id
                 WHERE zoom_level = $1
                 ${regionBoundingBoxQuery}
                 GROUP BY region.id`,
        values: [req.query["zoom_level"]]
      };
    } else {
      query = {
        text: `SELECT 'cluster' AS type,
             region_id id, ST_ASGeoJson(centroid) centroid,
             type_id as region_type,
             count(id)
             FROM active_tree_region tree_region
             WHERE zoom_level = $1
             GROUP BY region_id, centroid, type_id`,
        values: [req.query["zoom_level"]]
      };
    }
  }
  pool
    .query(query)
    .then(function(data) {
      console.log("ok");
      res.status(200).json({
        data: data.rows
      });
    })
    .catch(function(error) {
      console.log("not ok");
      console.log(error);
      throw error;
    });
});

module.exports = router;
