/* API COLLECTION FOR CHANNEL CRUD OPERATIONS */
const express = require("express");
const router = express.Router();
const actions = require("../../actions/actions");
const bodyParser = require("body-parser");
const db = require("../../db");
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
  let user = decoded.id;
  if(decoded.manager === true) channel_id = decoded.channel._id;
  if( channel_id === undefined ) return res.json({
    error: true,
    mssg: "Invalid Request"
  });

  let last_updated = req.body.last_updated;
  fetch_activity(channel_id, last_updated, user, 0, (result)=>{
    return res.json(result);
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
        priority : 1
      }
    };
  const match = { $match: { $text: { $search: searchQuery } } };

  dbo.collection(TABLE_CHANNELS).aggregate([match, query_data]).toArray( (err, result) => {
    if(err) return res.json({
      error: true,
      mssg: err
    });
    return res.json({
      error: false,
      mssg: result
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
      priority : 1
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
  * API end point for fetching activity list for list of channels
  * Requires (TOKEN, Channels_List {channel_id : last_updated})
  * Returns ({channel_id : List})
*/
router.post("/channels/fetch-activity-list", verifyRequestCommon, (req, res) => {
  const decoded = req.decoded;
  let user = decoded.id;
  if(req.body.channels_list === undefined){
    return res.json({error : true, mssg : "invalid request"});
  }

  let channels = JSON.parse(req.body.channels_list);
  let keys = Object.keys(channels);
  
  let length = keys.length;
  let result = {};
  
  if(length > 0){
    for(var i=0; i<length; i++){
      fetch_activity(keys[i], channels[keys[i]], user, i, (response)=>{
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

function fetch_activity(channel_id, last_updated, user, indx, callback){
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

  dbo.collection(TABLE_ACTIVITY).find(query_data)
    .toArray((err, result) => {
      if(err) return callback({ error : true, indx, mssg : err });
      if(result.length === 0) return callback({error : false, indx, data : result});
      /* OPTIMIZE */
      result.forEach((item, index, array) => {
        if(item.type === "poll"){
          let tup = item;
          let answer = false;
          Object.entries(tup.options).forEach(([key, value]) => {
            if(value.includes(user)){
              answer = key;
              return;
            }
          });
          tup["answered"] = answer;
          if(!answer)
            tup.options = Object.keys(tup.options);
          /* WE CAN CENSOR DATA ON POLL ASWERED ALSO, WE JUST NEED COUNT */
          item = tup;
        }

        if(index === array.length - 1){
          return callback({error: false, indx, data: result});
        }
      });
    });
}

module.exports = router;