/* API COLLECTION FOR USERS CRUD OPERATIONS */
const express = require("express");
const router = express.Router();
const actions = require("../../actions/actions");
const bodyParser = require("body-parser");
const constants = require("../../constants");
const TABLE_USERS = constants.TABLE_USERS;
const TABLE_COLLEGES = constants.TABLE_COLLEGES;
const TABLE_CATEGORIES = constants.TABLE_CATEGORIES;
const verifyCommonToken = actions.verifyCommonToken;

const db_static = require("../../db_static");
const dbo_static = db_static.getDb();

const db_users = require("../../db_users");
const dbo_users = db_users.getDb();

// const db_diag = require("../../db_diag");
// const dbo_diag = db_diag.getDb();

// const db_activities = require("../../db_activities");
// const dbo_activities = db_activities.getDb();

// const db_events = require("../../db_events");
// const dbo_events = db_events.getDb();

// const db_notifications = require("../../db_notifications");
// const dbo_notifications = db_notifications.getDb();

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

  dbo_users.collection(TABLE_USERS).aggregate([match, query_data, sort, limit]).toArray( (err, result) => {
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

/*
  * API end point to follow a user, update DB with the userid
  * Requires (TOKEN, channel_id)
  * Returns (ACKNOWLEDGEMENT)
*/
router.post("/users/connect", verifyRequestCommon, (req, res) => {
  const decoded = req.decoded;
  const id = decoded.id; /* USER ID */
  const user_id = req.body.user_id; /* ID OF USER THAT ONE WANTS TO CONNECT */

  dbo_users.collection(TABLE_USERS).findOne({ _id : user_id}, (err, result)=>{
    if(result){
      dbo_users.collection(TABLE_USERS).update({ _id :  user_id}, { $addToSet: { connection_requests : id }  }, () => {
        dbo_users.collection(TABLE_USERS).update({ _id : id }, { $addToSet: { sent_connection_requests : user_id }  }, (err) => {
          if(err)
            return res.json({
              error: true,
              mssg : err
            });
          return res.json({
            error : false,
            requested : true,
            mssg : "success"
          });
        });
      });
    }
    else  return res.json({
      error: true,
      mssg: err
    });
  });
});

router.post("/users/get-category-list", (req, res) => {
  dbo_static.collection(TABLE_CATEGORIES).find({ }).toArray((err, result)=>{
    if(result){
      return res.json({
        error: false,
        mssg: "Success listing colleges",
        data: result
      });
    }
    else return res.json({
      error: true,
      mssg: err
    });
  });
});

router.post("/users/get-college-list", (req, res) => {
  dbo_static.collection(TABLE_COLLEGES).find({ }).toArray((err, result)=>{
    if(result){
      return res.json({
        error: false,
        mssg: "Success listing colleges",
        data: result
      });
    }
    else return res.json({
      error: true,
      mssg: err
    });
  });
});

module.exports = router;