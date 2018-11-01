/* API COLLECTION FOR USERS CRUD OPERATIONS */
const express = require("express");
const router = express.Router();
const actions = require("../../actions/actions");
const bodyParser = require("body-parser");
const db = require("../../db");
const constants = require("../../constants");
const TABLE_USERS = constants.TABLE_USERS;
const verifyCommonToken = actions.verifyCommonToken;

const dbo = db.getDb();
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

/* HELPER */
const verifyRequestCommon = function (req, res, next) {
  verifyCommonToken(req, (err, decoded) => {
    if(err) {
      return res.json({
        error: true,
        mssg: "Token Verification failed."
      });
    } else {
      req.authorized = true;
      req.decoded = decoded;
    }
    next();
  });
};

/*
  * indexing style -- db.channels.createIndex( { name: "text", description: "text", creator: "text", category: "text" } )
  * query style -- db.channels.find( { $text: { $search: "wild" } } )
  * API end point to search available channels based on name, description and category
  * Requires (COMMON TOKEN)
  * Returns (results)
*/
router.post("/users/search", verifyRequestCommon, (req, res) => {
  // const decoded = req.decoded;
  let searchQuery = req.body.query;
  if( searchQuery === undefined ) return res.json({
    error: true,
    mssg: "Invalid Request"
  });
  const query_data =
    {
      $project: {
        _id : 1,
        name : 1,
        gender : 1,
        media : 1,
        bio : 1,
        score : { $meta : "textScore"},
      }
    };
  const match = { $match: { $text: { $search: searchQuery } } };
  const sort = { $sort : {score : -1}};
  const limit = { $limit : 10};

  dbo.collection(TABLE_USERS).aggregate([match, query_data, sort, limit]).toArray( (err, result) => {
    if(err) return res.json({
      error: true,
      mssg: err
    });
    return res.json({
      error: false,
      data: result
    });
  });
});

module.exports = router;