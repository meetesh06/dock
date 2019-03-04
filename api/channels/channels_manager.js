/* API COLLECTION FOR CHANNEL OPERATIONS MANAGER SIDE */
const express = require("express");
const router = express.Router();
const actions = require("../../actions/actions");
const bodyParser = require("body-parser");
const constants = require("../../constants");
const passwordHash = require("password-hash");
const TABLE_ACTIVITY = constants.TABLE_ACTIVITY;
const TABLE_USERS_ADMIN = constants.TABLE_USERS_ADMIN;
const TABLE_CHANNELS = constants.TABLE_CHANNELS;
const verifyManagerToken = actions.verifyManagerToken;
const sendToScope = actions.sendToScope;
const isValidDate = actions.isValidDate;
const saveFiles = actions.saveFiles;
const saveVideo = actions.saveVideo;
const UID = actions.UID;

const db_static = require("../../db_static");
const dbo_static = db_static.getDb();

const db_users = require("../../db_users");
const dbo_users = db_users.getDb();
const db_activities = require("../../db_activities");
const dbo_activities = db_activities.getDb();


router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

/* HELPER */
const verifyRequest = function (req, res, next) {
  verifyManagerToken(req, (err, decoded) => {
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
  * API end point to create a post
  * Requires (TOKEN, post)
  * Returns (ACKNOWLEDGEMENT, FIREBASE_EVENT)
*/
router.post("/channels/manager/create-post", verifyRequest, (req, res) => {
  const uid = UID(16);

  const decoded = req.decoded;
  const message = req.body.message;
  const config = req.body.config;
  const reaction_type = req.body.reaction_type;

  if ( message === undefined || config === undefined || reaction_type === undefined)
    return res.json({
      error: true,
      mssg: "missing fields"
    });
  
  const email = decoded.email;
  const channel = decoded.channel;
  const category = decoded.channel_category;
  const channel_name = decoded.channel_name;

  const _id = channel + "-" + uid;
  const reach = [];
  const views = [];
  const reactions = 0;
  const channel_visits = [];
  const story_views = [];
  const action_taken = [];
  const reactors = []; /* reaction given by poeple their id */
  const type = "post";
  const timestamp = new Date();
  const audience = [channel];
  
  const query_data = {
    _id,
    reach,
    views,
    type,
    timestamp,
    reactions,
    reactors,
    reaction_type,
    channel,
    audience,
    category,
    channel_name,
    message,
    config,
    email,
    channel_visits,
    story_views,
    action_taken
  };

  const hashtag = req.body.hashtag;
  const url = req.body.url;
  const event = req.body.event;

  if(hashtag){
    query_data.hashtag = hashtag;
  } else if(url){
    query_data.url = url;
  } else if(event){
    query_data.event = event;
  }

  dbo_activities.collection(TABLE_ACTIVITY).insertOne(query_data, function(err) {
    if (err) {
      return res.json({
        error: true,
        mssg: "server side error"
      });
    }

    updateChannel(channel, (err, err_mssg)=>{
      if(!err){
        res.status(200).json({
          error: false,
          mssg: "Success"
        });
  
        const payload = {
          data: {
            type: "post",
            content: JSON.stringify(query_data)
          },
          notification : {
            body : `New post in ${channel_name}`,
            title : ""+query_data["message"]
          }
        };
        sendToScope(query_data["audience"], payload);
      }
      else {
        res.status(200).json({
          error: true,
          mssg: err_mssg
        });
      }
    });
  });
});

/*
  * API end point to create an image post
  * Requires (TOKEN, message, image)
  * Returns (ACKNOWLEDGEMENT, FIREBASE_EVENT)
*/
router.post("/channels/manager/create-image-post", verifyRequest, (req, res) => {
  const uid = UID(16);
  const decoded = req.decoded;
  const message = req.body.message;
  const reaction_type = req.body.reaction_type;

  if(message === undefined || reaction_type === undefined)
    return res.json({
      error: true,
      mssg: "missing fields"
    });

  if(req.files === undefined || req.files === null || req.files.length === 0) {
    return res.json({
      error: true,
      mssg: "invalid request, no files"
    });
  }

  const email = decoded.email;
  const channel = decoded.channel;
  const category = decoded.channel_category;
  const channel_name = decoded.channel_name;

  const _id = channel + "-" + uid;
  const reach = [];
  const views = [];
  const reactions = 0;
  const reactors = [];
  const channel_visits = [];
  const story_views = [];
  const action_taken = [];
  const type = "post-image";
  const timestamp = new Date();
  const audience = [channel];
  
  const query_data = {
    _id,
    reach,
    views,
    type,
    timestamp,
    channel,
    audience,
    reaction_type,
    reactions,
    reactors,
    message,
    channel_name,
    category,
    email,
    channel_visits,
    story_views,
    action_taken,
  };

  const hashtag = req.body.hashtag;
  const url = req.body.url;
  const event = req.body.event;

  if(hashtag){
    query_data.hashtag = hashtag;
  } else if(url){
    query_data.url = url;
  } else if(event){
    query_data.event = event;
  }

  saveFiles(req.files, function(media, err) {
    if (err) {
      return res.json({
        error: true,
        mssg: err
      });
    } else {
      query_data["media"] = media;
      dbo_activities.collection(TABLE_ACTIVITY).insertOne(query_data, function(err) {
        if (err) {
          return res.json({
            error: true,
            mssg: "server side error"
          });
        }
    
        updateChannel(channel, (err, err_mssg)=>{
          if(!err){
            res.status(200).json({
              error: false,
              mssg: "Success"
            });
        
            const payload = {
              data: {
                type: "post",
                content: JSON.stringify(query_data)
              },
              notification : {
                body : `New post in ${channel_name}`,
                title : ""+query_data["message"]
              }
            };
            sendToScope(query_data["audience"], payload);
          } else {
            res.status(200).json({
              error: true,
              mssg: err_mssg
            });
          }
        });
      });
    }
  });
});

/*
  * API end point to create an video post
  * Requires (TOKEN, message, video)
  * Returns (ACKNOWLEDGEMENT, FIREBASE_EVENT)
*/
router.post("/channels/manager/create-video-post", verifyRequest, (req, res) => {
  const uid = UID(16);
  const decoded = req.decoded;
  const message = req.body.message;
  const reaction_type = req.body.reaction_type;

  if (message === undefined || reaction_type === undefined)
    return res.json({
      error: true,
      mssg: "missing fields"
    });

  if(req.files === undefined || req.files === null || req.files.length === 0) {
    return res.json({
      error: true,
      mssg: "invalid request, no files"
    });
  }
    
  if(req.files.file === undefined) return res.json({
    error: true,
    mssg: "invalid request, no files"
  });

  const email = decoded.email;
  const channel = decoded.channel;
  const category = decoded.channel_category;
  const channel_name = decoded.channel_name;
  

  const _id = channel + "-" + uid;
  const reach = [];
  const views = [];
  const reactions = 0;
  const reactors = [];
  const channel_visits = [];
  const story_views = [];
  const action_taken = [];
  const type = "post-video";
  const timestamp = new Date();
  const audience = [channel];
  
  const query_data = {
    _id,
    reach,
    views,
    type,
    timestamp,
    channel,
    audience,
    reactions,
    reactors,
    reaction_type,
    message,
    category,
    channel_name,
    email,
    channel_visits,
    story_views,
    action_taken,
  };

  const hashtag = req.body.hashtag;
  const url = req.body.url;
  const event = req.body.event;

  if(hashtag){
    query_data.hashtag = hashtag;
  } else if(url){
    query_data.url = url;
  } else if(event){
    query_data.event = event;
  }

  saveVideo(req.files.file, function(err, filename) {
    if (err) {
      return res.json({
        error: true,
        mssg: err
      });
    } else {
      query_data["media"] = filename;
      dbo_activities.collection(TABLE_ACTIVITY).insertOne(query_data, function(err) {
        if (err) {
          return res.json({
            error: true,
            mssg: "server side error"
          });
        }
    
        updateChannel(channel, (err, err_mssg)=>{
          if(!err){
            res.status(200).json({
              error: false,
              mssg: "Success"
            });
        
            const payload = {
              data: {
                type: "post",
                content: JSON.stringify(query_data)
              },
              notification : {
                body : `New post in ${channel_name}`,
                title : ""+query_data["message"]
              }
            };
            sendToScope(query_data["audience"], payload);
          } else {
            res.status(200).json({
              error: true,
              mssg: err_mssg
            });
          }
        });
      });
    }
  });
});

/*
  * API end point to get a list of admin members of a channel
  * Requires (TOKEN, last_updated)
  * Returns (list_members)
*/
router.post("/channels/manager/get-member-list", verifyRequest, (req, res) => {
  const decoded = req.decoded;
  const channel = decoded.channel;
  
  const query_data = {
    channel_id : channel,
    $project : {
      _id : 1,
      name : 1,
      user_id : 1,
    }
  };
  
  dbo_users.collection(TABLE_USERS_ADMIN).find(query_data).toArray( (err, result) => {
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
  * API end point to add a new admin member to a channel
  * Requires (TOKEN, email, password, name)
  * Returns (DATA)
*/
router.post("/channels/manager/add-member", verifyRequest, (req, res) => {
  const decoded = req.decoded;
  const channel = decoded.channel;
  const college = decoded.college;

  const user_id = req.body.user_id;
  const password = req.body.password;
  const name = req.body.name;
  const timestamp = new Date();

  if( user_id === undefined || password === undefined || name === undefined ) return res.json({
    error: true,
    mssg: "invalid Request"
  });

  const generated_password = passwordHash.generate(password);
  dbo_users.collection(TABLE_USERS_ADMIN).insertOne({
    _id : user_id,
    password: generated_password,
    name,
    college,
    channel_id : channel,
    created_on : timestamp,
    authority : 101
  }, (err) => {
    if(err) 
      return res.json({
        error: true,
        mssg: err
      });
    return res.json({
      error: false,
    });
  });
});

/*
  * API end point to add a new admin member to a channel
  * Requires (TOKEN, email, password, name)
  * Returns (DATA)
*/
router.post("/channels/manager/remove-member", verifyRequest, (req, res) => {
  const user_id = req.body._id;

  if( user_id === undefined) return res.json({
    error: true,
    mssg: "invalid Request"
  });

  dbo_users.collection(TABLE_USERS_ADMIN).remove({
    _id : user_id,
  }, (err) => {
    if(err) 
      return res.json({
        error: true,
        mssg: err
      });
    return res.json({
      error: false,
    });
  });
});

/*
  * API end point to fetch event data
  * Requires (TOKEN, event_id)
  * Returns (event_data_object, UPDATES_VIEWS)
*/
router.post("/channels/manager/fetch-channel-data", verifyRequest, (req, res) => {
  const decoded = req.decoded;
  const _id = decoded.channel;

  if ( _id === undefined ) return res.json({
    error: true,
    mssg: "missing fields"
  });

  const query_data =
    {
      $project: {
        _id: 1,
        name: 1,
        description: 1,
        media: 1,
        private : 1,
        followers: { $size: "$followers" },
        social_link : 1,
        category : 1,
        streak : 1,
        authority : 1,
        reactions : 1
      }
    };
  const match = { 
    $match: {
      $and: [ 
        { _id }
      ]
    }
  };
  
  dbo_static.collection(TABLE_CHANNELS).aggregate([query_data, match]).toArray( (err, result) => {
    if(err) return res.json({
      error: true,
      mssg: err
    });
    if(result){
      return res.json({
        error: false,
        data: result
      });
    } else {
      return res.json({
        error: true,
        mssg : "No Channel Found"
      });
    }
  });
});

router.post("/channels/manager/update-channel", verifyRequest, (req, res) => {
  const decoded = req.decoded;
  const _id = decoded.channel;

  const description = req.body.description;
  const social_link = req.body.social_link;

  console.log(_id, description, social_link);

  if ( _id === undefined  || description  === undefined || social_link === undefined ) return res.json({
    error: true,
    mssg: "invalid request"
  });

  dbo_static.collection(TABLE_CHANNELS).update({ _id}, { $set : { description, social_link} }, (err) => {
    if(err) return res.json({
      error : true
    });
    return res.json({
      error : false
    });
  });
});

/*
  * Function to update channel with new timestamp & last updates.
*/
function updateChannel(_id, callback){
  dbo_static.collection(TABLE_CHANNELS).findOne({ _id}, (err, result)=>{
    if(!err){
      const last_updated = result.last_updated === undefined ? new Date() : result.last_updated;
      let ts = last_updated.getTime();
      let cs = new Date().getTime();
      let diff = (constants.STORIES_VALID_THRESHOLD *  24 * 60 * 60 * 1000) - (cs - ts);
      let streak;
      if(diff > 0){
        streak = result.streak === undefined ? 1 : result.streak + 1;
      } else {
        streak = 0;
      }
      dbo_static.collection(TABLE_CHANNELS).update({ _id}, { $set : { streak, last_updated : new Date()} }, (err_r) => {
        if(!err_r){
          callback(false, null);
        } else {
          callback(true, err_r);
        }
      });
    }
    else {
      callback(true, err);
    }
  });
}

module.exports = router;