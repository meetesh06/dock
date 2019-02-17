/* API COLLECTION FOR CHANNEL CRUD OPERATIONS */
const express = require("express");
const router = express.Router();
const actions = require("../../actions/actions");
const bodyParser = require("body-parser");
const db = require("../../db");
var moment = require("moment");
const constants = require("../../constants");
const TABLE_ACTIVITY = constants.TABLE_ACTIVITY;
const TABLE_CHANNELS = constants.TABLE_CHANNELS;
const verifyCommonToken = actions.verifyCommonToken;
const isValidDate = actions.isValidDate;
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
  * API end point for getting activity list
  * Requires (TOKEN, channel_id, last_updated)
  * Returns (activity_list_based_on_last_update)
*/
router.post("/channels/get-activity-list", verifyRequestCommon, (req, res) => {
  const decoded = req.decoded;
  let channel_id = req.body.channel_id;
  let last_updated = req.body.last_updated;
  if(decoded.manager === true) channel_id = decoded.channel._id;
  if( channel_id === undefined || last_updated === undefined) return res.json({
    error: true,
    mssg: "Invalid Request"
  });

  fetch_activity(channel_id, last_updated, 0, (result)=>{
    return res.json(result);
  });
});


/*
  * API end point for getting story
  * Requires (TOKEN, channel_id)
  * Returns (activity_list_based_on_last_update)
*/
router.post("/channels/get-story", verifyRequestCommon, (req, res) => {
  let channel_id = req.body.channel_id;
  let last_updated = "" + moment().add(-1, "days").format();
  if( channel_id === undefined || last_updated === undefined) return res.json({
    error: true,
    mssg: "Invalid Request"
  });

  fetch_activity(channel_id, last_updated, 0, (result)=>{
    return res.json(result);
  });
});

/*
  * API end point for getting activity list
  * Requires (TOKEN)
  * Returns (activity_list_based_on_last_popularity)
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
      name: 1,
      media: 1,
      options: 1,
      channel_name: 1,
      poll_type: 1

    }
  };
  const sort = { $sort : { views : -1 }};
  let match = {};
  if(category === "hottest")
    match = { $match : { "timestamp" : { $gte : d } } };
  else
    match = { $match : { "timestamp" : { $gte : d }, "category":  category } };
  dbo.collection(TABLE_ACTIVITY).aggregate([query_data, match, sort]).toArray( (err, result) => {
    if(err) return res.json({error : true, mssg  : err});
    return res.json({error : false, data : result});
  });

});


/*
  * indexing style -- db.channels.createIndex( { name: "text", description: "text", creator: "text", category: "text" } )
  * query style -- db.channels.find( { $text: { $search: "wild" } } )
  * API end point to search available channels based on name, description and category
  * Requires (COMMON TOKEN)
  * Returns (results)
*/
router.post("/channels/search", verifyRequestCommon, (req, res) => {
  // const decoded = req.decoded;
  let searchQuery = req.body.query;
  if( searchQuery === undefined ) return res.json({
    error: true,
    mssg: "Invalid Request"
  });
  const query_data =
    {
      $project: {
        _id: 1,
        name: 1,
        followers: { $size: "$followers" },
        media : 1,
        description : 1,
        category : 1,
        creator : 1,
        score : { $meta : "textScore"},
        priority : 1
      }
    };
  const match = { $match: { $text: { $search: searchQuery } } };
  const sort = { $sort : {score : -1}};
  const limit = { $limit : 10};

  dbo.collection(TABLE_CHANNELS).aggregate([match, query_data, sort, limit]).toArray( (err, result) => {
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
  * API end point to get top channels based on the cateogry of intersts user likes.
  * Requires (COMMON TOKEN, category_array, already_subscribed_channels, count)
  * Returns (results)
*/
router.post("/channels/top", verifyRequestCommon, (req, res) => {
  let cat_list = req.body.category_list;
  let channels_list = req.body.channels_list;
  let count = req.body.count;

  if( cat_list === undefined || count === undefined || channels_list === undefined) return res.json({
    error: true,
    mssg: "Invalid Request"
  });

  let category_list = JSON.parse(cat_list);
  let channels = JSON.parse(channels_list);
  const query_data ={
    $project: {
      _id: 1,
      name: 1,
      followers: { $size: "$followers" },
      media : 1,
      description : 1,
      category : 1,
      category_found : { $in : ["$category", category_list] },
      channel_already : { $in : ["$_id", channels] },
      creator : 1,
      priority : 1,
      college: 1
    }
  };
  const sort = { $sort : { followers : -1 }};
  const match = { $match : { category_found : true, channel_already : false }};
  const limit = { $limit : parseInt(count)};

  dbo.collection(TABLE_CHANNELS).aggregate([query_data, match, sort, limit]).toArray( (err, result) => {
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
  const timestamp = new Date("" + moment().add(-1, "days").format());
  const query_data = {
    $project: {
      _id: 1,
      name: 1,
      media : 1,
      description : 1,
      category : 1,
      channel_visits : 1,
      story_views : 1,
      creator : 1,
      priority : 1,
      private : 1,
      college: 1,
      last_updated : 1
    }
  };

  const sort = { $sort : { story_views : -1, channel_visits : -1 }};
  const match = { $match : { category, last_updated : { $gte : timestamp }, private : private_channels}};

  dbo.collection(TABLE_CHANNELS).aggregate([query_data, match, sort]).toArray( (err, result) => {
    if(err) return res.json({error : true, mssg  : err});
    return res.json({error : false, data : result});
  });
});

/*
  * API end point to get top channels from all categories, channel list entries are ignored
  * Requires (COMMON TOKEN, channel_list)
  * Returns (results)
*/
router.post("/channels/all", verifyRequestCommon, (req, res) => {
  let count = req.body.count;
  let channels_list = req.body.channels_list;
  if( channels_list === undefined || count === undefined || !parseInt(count) ) return res.json({
    error: true,
    mssg: "Invalid Request"
  });

  let channels = JSON.parse(channels_list);

  const query_data ={
    $project: {
      _id: 1,
      name: 1,
      followers: { $size: "$followers" },
      media : 1,
      description : 1,
      category : 1,
      channel_already : { $in : ["$_id", channels] },
      creator : 1,
      priority : 1
    }
  };
  const sort = { $sort : { followers : -1 }};
  const match = { $match : { channel_already : false }};
  const limit = { $limit : parseInt(count)};

  dbo.collection(TABLE_CHANNELS).aggregate([query_data, match, sort, limit]).toArray( (err, result) => {
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

  let channels = JSON.parse(req.body.channels_list);
  let keys = Object.keys(channels);
  
  let length = keys.length;
  let result = {};
  
  if(length > 0){
    for(var i=0; i<length; i++){
      fetch_activity(keys[i], channels[keys[i]], i, (response)=>{
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

function fetch_activity(channel_id, last_updated, indx, callback){
  if(last_updated === undefined ) return callback({error : true, indx, mssg : "invalid request"});
  
  last_updated = new Date(last_updated);
  const query_data = {
    channel : channel_id,
  };

  if(isValidDate(last_updated)) {
    query_data["timestamp"] = {
      $gt: last_updated
    };
  }

  dbo.collection(TABLE_ACTIVITY).find(query_data).sort({ timestamp: -1 }).toArray((err, result) => {
    if(err) return callback({ error : true, indx, mssg : err });
    //if(result.length === 0) return callback({error : false, indx, data : result});
    return callback({error : false, indx, data : result});

    // result.forEach((item, index, array) => {
    //   item.views = item.views.length;
    //   if(item.type === "poll"){
    //     let tup = item;
    //     let answer = false;
    //     Object.entries(tup.options).forEach(([key, value]) => {
    //       if(value.includes(user)){
    //         answer = key;
    //         return;
    //       }
    //     });
    //     tup["answered"] = answer;
    //     if(!answer)
    //       tup.options = Object.keys(tup.options);
    //       /* WE CAN CENSOR DATA ON POLL ASWERED ALSO, WE JUST NEED COUNT */
    //     item = tup;
    //   }

    //   if(index === array.length - 1){
    //     return callback({error: false, indx, data: result});
    //   }
    // });
  });
}

module.exports = router;