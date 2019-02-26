/* API COLLECTION FOR CHANNEL CRUD OPERATIONS */
const express = require("express");
const router = express.Router();
const actions = require("../../actions/actions");
const bodyParser = require("body-parser");
const constants = require("../../constants");

const TABLE_NOTIFICATIONS = constants.TABLE_NOTIFICATIONS;
const verifyUserToken = actions.verifyUserToken;
const isValidDate = actions.isValidDate;

// const db_static = require("../../db_static");
// const dbo_static = db_static.getDb();

// const db_users = require("../../db_users");
// const dbo_users = db_users.getDb();

// const db_diag = require("../../db_diag");
// const dbo_diag = db_diag.getDb();

// const db_activities = require("../../db_activities");
// const dbo_activities = db_activities.getDb();

// const db_events = require("../../db_events");
// const dbo_events = db_events.getDb();

const db_notifications = require("../../db_notifications");
const dbo_notifications = db_notifications.getDb();

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

/* HELPER */
const verifyRequest = function (req, res, next) {
  verifyUserToken(req, (err, decoded) => {
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
  * API end point to get top channels based on the cateogry of intersts user likes.
  * Requires (COMMON TOKEN, category_array, already_subscribed_channels, count)
  * Returns (results)
*/
router.post("/notifications/user/fetch", (req, res) => {
  console.log(req.body);
  let subs = req.body.subs;
  try {
    subs = JSON.parse(subs);
    if(subs.length === 0) return res.json({
      error: true,
      mssg: "missing fields"
    });
  } catch(e) {
    return res.json({
      error: true,
      mssg: "missing fields"
    });
  }

  let keys = Object.keys(subs);
  
  let length = keys.length;
  let result = [];
  let resultCount = {};
  
  if(length > 0){
    for(var i=0; i<length; i++){
      fetch_notifications(keys[i], subs[keys[i]], i, (response)=>{
        if(response.error) return res.json(response);
        resultCount[keys[response.indx]] = response;
        result = [...result, ...response.data];
        if(Object.keys(resultCount).length === length){
          // console.log(result);
          return res.json({error : false, data : result});
        }
      });
    }
  } else {
    return res.json({
      error : true,
      mssg : "invalid request"
    });
  }
  

});

module.exports = router;

const fetch_notifications = (channel_id, last_updated, indx, callback) => {
  if(last_updated === undefined ) return callback({error : true, indx, mssg : "invalid request"});
  
  last_updated = new Date(last_updated);

  const query_data =
    {
      $project: {
        _id: 1,
        // decoded: 1,
        message: 1,
        type: 1,
        audience : 1,
        timestamp : 1
      }
    };
  
  let match = { 
    $match: {
      $and: [
        { audience: channel_id }
      ]
    }
  };
  
  const sort = { $sort : { timestamp : -1 }};
  const limit = { $limit : 15 };

  if(isValidDate(last_updated)) {
    match = { 
      $match: {
        $and: [
          { audience: channel_id },
          { timestamp: { $gt: last_updated } }
        ]
      }
    };
  }
  
  dbo_notifications.collection(TABLE_NOTIFICATIONS).aggregate([query_data, match, sort, limit]).toArray( (err, result) => {
    if(err) return callback({ error : true, indx, mssg : err });
    if(result.length === 0) return callback({error: false, indx, data: result});
    return callback({error: false, indx, data: result});
  });
}