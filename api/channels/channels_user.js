/* API COLLECTION FOR CHANNEL - USER SIDE */
const express = require("express");
const actions = require("../../actions/actions");
const constants = require("../../constants");
const TABLE_ACTIVITY = constants.TABLE_ACTIVITY;
const verifyAnonymousToken = actions.verifyAnonymousToken;
const TABLE_USERS = constants.TABLE_USERS;
const TABLE_CHANNELS = constants.TABLE_CHANNELS;

const db_static = require("../../db_static");
const dbo_static = db_static.getDb();

const db_users = require("../../db_users");
const dbo_users = db_users.getDb();

const db_activities = require("../../db_activities");
const dbo_activities = db_activities.getDb();

const router = express.Router();

const verifyRequest = function (req, res, next) {
  verifyAnonymousToken(req, (err, decoded) => {
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
  * API end point to view similar tags
  * Requires (TOKEN, tag)
  * Returns (array)
*/
router.post("/channels/user/collect-tag", verifyRequest, (req, res) => {
  const decoded = req.decoded;
  const _id = decoded.id;

  const hashtag = req.body.hashtag;
  if(hashtag === undefined || hashtag === ""){
    return res.json({
      error : true,
      mssg : "invalid request"
    });
  }

  const query_data =
    {
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
  const match = { $match : {hashtag}};
  const sort = { $sort : {timestamp : -1, reactions : -1, views : -1}};
  dbo_activities.collection(TABLE_ACTIVITY).aggregate([query_data, match, sort]).toArray((err, result)=>{
    if(err){
      return res.json({
        error : true,
        mssg : err
      });
    }
    return res.json({
      error : false,
      data : result
    });
  });
});

/*
  * API end point to update story views
  * Requires (TOKEN, _id of story)
  * Returns (ACKNOWLEDGEMENT)
*/
router.post("/channels/update-story-views", verifyRequest, (req, res) => {
  const _id = req.body._id;

  if(_id === undefined ) 
    return res.json({
      error: true,
      mssg : "Invalid Request"
    });

  const id = req.decoded.id;
  updateField("story_views", _id, id);

  return res.json({
    error : false
  });
});

/*
  * API end point to update channel visits
  * Requires (TOKEN, _id of story)
  * Returns (ACKNOWLEDGEMENT)
*/
router.post("/channels/update-channel-visits", verifyRequest, (req, res) => {
  const _id = req.body._id;
  if(_id === undefined ) 
    return res.json({
      error: true,
      mssg : "Invalid Request"
    });

  const id = req.decoded.id;
  updateField("channel_visits", _id, id);

  return res.json({
    error : false
  });
});

/*
  * API end point to update channel visits
  * Requires (TOKEN, _id of story)
  * Returns (ACKNOWLEDGEMENT)
*/
router.post("/channels/update-action-taken", verifyRequest, (req, res) => {
  const _id = req.body._id;
  if(_id === undefined ) 
    return res.json({
      error: true,
      mssg : "Invalid Request"
    });

  const id = req.decoded.id;
  updateField("action_taken", _id, id);

  return res.json({
    error : false
  });
});

/*
  * API end point to follow a channel, update DB with the userid
  * Requires (TOKEN, channel_id)
  * Returns (ACKNOWLEDGEMENT)
*/
router.post("/channels/user/follow", verifyRequest, (req, res) => {
  const decoded = req.decoded;
  const id = decoded.id;
  const channel_id = req.body.channel_id;
  const hash = req.body.hash;

  if(channel_id === undefined ) 
    return res.json({
      error: true,
      mssg : "Invalid Request"
    });
  dbo_static.collection(TABLE_CHANNELS).findOne({ _id : channel_id}, (err, result)=>{
    if(result){
      if(result.private){
        console.log("PRIVATE");
        dbo_static.collection(TABLE_CHANNELS).findOne({ _id : channel_id, hash}, (err, result)=>{
          if(err) 
            return res.json({
              error: true,
              mssg : err
            });
          if(result){
            dbo_static.collection(TABLE_CHANNELS).update({ _id : channel_id }, { $addToSet: { followers : id }  }, () => {
              dbo_users.collection(TABLE_USERS).update({ _id : id }, { $addToSet: { followed_channels : channel_id }  }, (err) => {
                if(err) 
                  return res.json({
                    error: true,
                    mssg : err
                  });
                return res.json({
                  error : false,
                });
              });
            });
          } else {
            return res.json({
              error: true,
              mssg : "Invalid Passkey"
            });
          }
        });
      } else {
        dbo_static.collection(TABLE_CHANNELS).update({ _id : channel_id }, { $addToSet: { followers : id }  }, () => {
          dbo_users.collection(TABLE_USERS).update({ _id : id }, { $addToSet: { followed_channels : channel_id }  }, (err) => {
            if(err) 
              return res.json({
                error: true,
                mssg : err
              });
            return res.json({
              error : false,
            });
          });
        });
      }
    }
    else  return res.json({
      error: true,
      mssg: err
    });
  });
});

/*
  * API end point to unfollow a channel, update DB with the userid
  * Requires (TOKEN, channel_id)
  * Returns (ACKNOWLEDGEMENT)
*/
router.post("/channels/user/unfollow", verifyRequest, (req, res) => {
  const decoded = req.decoded;
  const id = decoded.id;
  const channel_id = req.body.channel_id;

  dbo_static.collection(TABLE_CHANNELS).findOne({ _id : channel_id}, (err, result)=>{
    if(result){
      dbo_static.collection(TABLE_CHANNELS).update({ _id : channel_id }, { $pull: { followers : id }  }, (err) => {
        console.log(err);
      });
      dbo_users.collection(TABLE_USERS).update({ _id : id }, { $pull: { followed_channels : channel_id }  }, (err) => {
        if(err) 
          return res.json({
            error: true,
            mssg : err
          });
        return res.json({
          error : false,
        });
      });
    } else {
      return res.json({
        error: true,
        mssg: err
      });
    }
  });
});

/*
  * API end point to unfollow a channel, update DB with the userid
  * Requires (TOKEN, channel_id)
  * Returns (ACKNOWLEDGEMENT)
*/
router.post("/channels/user/react", verifyRequest, (req, res) => {
  const decoded = req.decoded;
  const id = decoded.id;
  const _id = req.body._id;
  const channel_id = _id.split("-")[0];
  const count_str = req.body.count;
  const count = parseInt(count_str);

  dbo_activities.collection(TABLE_ACTIVITY).update({ _id}, {$inc : {reactions : parseInt(count)}}, (err)=>{
    if(err)
      return res.json({
        error : true
      });
    dbo_static.collection(TABLE_CHANNELS).update({ _id : channel_id}, {$inc : {reactions : parseInt(count)}}, (err)=>{
      if(err)
        return res.json({
          error : true
        });
      dbo_activities.collection(TABLE_ACTIVITY).update({ _id, reactors: { $elemMatch: { _id: id}}}, {$inc : { "reactors.$.count" : count}}, (err, result)=>{
        if(err)
          return res.json({
            error : true,
          });
        if(result.result.nModified > 0){
          return res.json({
            error : false
          });
        } else {
          dbo_activities.collection(TABLE_ACTIVITY).update({ _id}, {$addToSet : { reactors: {_id : id, count}}}, (err)=>{
            if(err)
              return res.json({
                error : true,
              });
            return res.json({
              error : false
            });
          });
        }
      });
    });
  });
});

/*
  * DEPRECATED
  * API end point to fetch details for a channel
  * Requires (TOKEN, channel_id)
  * Returns (ACKNOWLEDGEMENT, CHANNEL DATA OBJECT - CENSORED) 
  * DEPRECATED
*/
router.post("/channels/user/fetch-channel", verifyRequest, (req, res) => {
  const decoded = req.decoded;
  const id = decoded.id;
  let channel_id = req.body.channel_id;

  if ( channel_id === undefined ) return res.json({
    error: true,
    mssg: "invalid request"
  });
  
  dbo_static.collection(TABLE_CHANNELS).findOne({_id : channel_id}, (err, result) =>{
    result.requests = result.requests === undefined ? [] : result.requests;
    result["followed"] = result.followers.includes(id);
    result["requested"] = result.requests.includes(id);
    result.followers = result.followers.length;
    
    result.users = result.followers;
    if(err)
      return res.json({
        error : true,
        mssg : err
      });
    return res.json({
      error : false,
      data : result
    });
  });
});


/*
  * API end point to fetch channel data
  * Requires (TOKEN, channel_id)
  * Returns (event_data_object, UPDATES_VIEWS)
*/
router.post("/channels/user/fetch-channel-data", verifyRequest, (req, res) => {
  let _id = req.body._id;
  if ( _id === undefined ) return res.json({
    error: true,
    mssg: "missing fields"
  });

  const query_data ={
    $project: {
      _id: 1,
      name: 1,
      followers: { $size: "$followers" },
      media : 1,
      description : 1,
      category : 1,
      creator : 1,
      reactions : 1,
      priority : 1,
      private : 1,
      college: 1
    }
  };
  
  const match = { $match : { _id }};

  dbo_static.collection(TABLE_CHANNELS).aggregate([query_data, match]).toArray( (err, result) => {
    if(err) return res.json({error : true, mssg  : err});
    return res.json({error : false, data : result});
  });
});

function updateField(field, _id, id){
  dbo_activities.collection(TABLE_ACTIVITY).update({ _id }, { $addToSet : {[field] : id} }, (err)=>{
    if(err) console.log(err);
  });
  return;
}

module.exports = router;