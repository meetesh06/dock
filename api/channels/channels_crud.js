/* API COLLECTION FOR CHANNEL CRUD OPERATIONS */
const express = require("express");
const router = express.Router();
const actions = require("../../actions/actions");
const bodyParser = require("body-parser");
var moment = require("moment");
const constants = require("../../constants");
const TABLE_ACTIVITY = constants.TABLE_ACTIVITY;
const TABLE_CHANNELS = constants.TABLE_CHANNELS;
const verifyCommonToken = actions.verifyCommonToken;
const isValidDate = actions.isValidDate;
const STORIES_VALID_THRESHOLD = constants.STORIES_VALID_THRESHOLD;
const db_static = require("../../db_static");
const dbo_static = db_static.getDb();

const db_activities = require("../../db_activities");
const dbo_activities = db_activities.getDb();

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
  * API end point for getting story
  * Requires (TOKEN, channel_id)
  * Returns (activity_list_based_on_last_update)
*/
router.post("/channels/get-story", verifyRequestCommon, (req, res) => {
  let channel_id = req.body.channel_id;
  const decoded = req.decoded;
  const id = decoded.id;
  let last_updated = "" + moment().add(-1 * constants.STORIES_VALID_THRESHOLD, "days").format();
  if( channel_id === undefined || last_updated === undefined) return res.json({
    error: true,
    mssg: "Invalid Request"
  });

  fetch_activity(id, channel_id, last_updated, 0, (result)=>{
    return res.json(result);
  });
});

/* 
  * DEPRECATED
  * API end point for getting activity list based on category
  * Requires (TOKEN)
  * Returns (activity_list_based_on_last_popularity)
  * DEPRECATED
*/
router.post("/channels/fetch-popular-activity", verifyRequestCommon, (req, res) => {
  const category = req.body.category;
  if( category === undefined ) return res.json({
    error: true,
    mssg: "Invalid Request"
  });
  let d = new Date();
  d.setDate(d.getDate() - 2);
  const query_data ={
    $project: {
      _id: 1,
      reach: { $size: "$reach" },
      views: { $size: "$views" },
      type: 1,
      timestamp: 1,
      channel: 1,
      audience: 1,
      category : 1,
      message: 1,
      email: 1,
      config : 1, 
      name: 1,
      media: 1,
      channel_name: 1,
      hashtag : 1,
      url : 1,
      event : 1
    }
  };
  const sort = { $sort : { views : -1 }};
  let match = { $match : { "timestamp" : { $gte : d }, "category":  category } };
  dbo_activities.collection(TABLE_ACTIVITY).aggregate([query_data, match, sort]).toArray( (err, result) => {
    if(err) return res.json({error : true, mssg  : err});
    return res.json({error : false, data : result});
  });

});

/*
  * API end point to get channels of a category in sorted order of thier popularity
  * Requires (COMMON TOKEN, category)
  * Returns (results)
*/
router.post("/channels/get-category-channels", verifyRequestCommon, (req, res) => {
  let category = req.body.category;
  if( category === undefined) return res.json({
    error: true,
    mssg: "Invalid Request"
  });
  const private_channels = req.body.private === undefined ? false : req.body.private;
  const timestamp = new Date("" + moment().add(-1 * STORIES_VALID_THRESHOLD, "days").format());
  const query_data = {
    $project: {
      _id: 1,
      name: 1,
      media : 1,
      description : 1,
      category : 1,
      streak : 1,
      reactions : 1,
      creator : 1,
      priority : 1,
      private : 1,
      college: 1,
      last_updated : 1
    }
  };

  const sort = { $sort : { reactions : -1, last_updated : -1, streak : -1 }};
  let match;
  if(category === "xxx"){
    match = { $match : { last_updated : { $gte : timestamp }, private : private_channels}};
  } else {
    match = { $match : { category, last_updated : { $gte : timestamp }, private : private_channels}};
  }

  dbo_static.collection(TABLE_CHANNELS).aggregate([query_data, match, sort]).toArray( (err, result) => {
    if(err) return res.json({error : true, mssg  : err});
    return res.json({error : false, data : result});
  });
});

/*
  * API end point for fetching activity list for list of channels
  * Requires (TOKEN, Channels_List {channel_id : last_updated})
  * Returns ({channel_id : List})
*/
router.post("/channels/fetch-activity-list", verifyRequestCommon, (req, res) => {
  if(req.body.channels_list === undefined){
    return res.json({error : true, mssg : "invalid request"});
  }
  const decoded = req.decoded;
  const id = decoded.id;
  let channels = JSON.parse(req.body.channels_list);
  let keys = Object.keys(channels);
  
  let length = keys.length;
  let result = {};
  let last_updated = "" + moment().add(-1 * STORIES_VALID_THRESHOLD, "days").format();
  
  if(length > 0){
    for(var i=0; i<length; i++){
      fetch_activity(id, keys[i], last_updated, i, (response)=>{
        if(response.error) return res.json(response);
        result[keys[response.indx]] = response;
        if(Object.keys(result).length === length){
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

/* HELPER FUNCTION */
function fetch_activity(_id, channel_id, last_updated, indx, callback){
  console.log(_id);
  if(last_updated === undefined ) return callback({error : true, indx, mssg : "invalid request"});
  
  last_updated = new Date(last_updated);

  const query_data ={
    $project: {
      _id: 1,
      reach: { $size: "$reach" },
      views: { $size: "$views" },
      type: 1,
      timestamp: 1,
      channel: 1,
      audience: 1,
      category : 1,
      message: 1,
      config : 1,
      reactions : 1,
      reaction_type : 1,
      my_reactions: {
        $filter: {
          input: "$reactors",
          as: "reactors",
          cond: { $eq: [ "$$reactors._id", _id ] }
        }
      },
      name: 1,
      media: 1,
      channel_name: 1,
      hashtag : 1,
      url : 1,
      event : 1
    }
  };

  let query = { channel : channel_id};
  if(isValidDate(last_updated)) {
    query["timestamp"] = {
      $gt: last_updated
    };
  }
  let match = { $match : query};
  const sort = { $sort : { timestamp : -1 }};

  dbo_activities.collection(TABLE_ACTIVITY).aggregate([query_data, match, sort]).toArray((err, result) => {
    if(err) return callback({ error : true, indx, mssg : err });
    return callback({error : false, indx, data : result});
  });
}

module.exports = router;