/* API COLLECTION FOR CHANNEL - USER SIDE */
const express = require("express");
const actions = require("../../actions/actions");
const db = require("../../db");
const constants = require("../../constants");
const TABLE_ACTIVITY = constants.TABLE_ACTIVITY;
const verifyAnonymousToken = actions.verifyAnonymousToken;
const TABLE_USERS = constants.TABLE_USERS;
const TABLE_CHANNELS = constants.TABLE_CHANNELS;
const dbo = db.getDb();
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
  * API end point to follow a channel, update DB with the userid
  * Requires (TOKEN, channel_id)
  * Returns (ACKNOWLEDGEMENT)
*/
router.post("/channels/update-read", verifyRequest, (req, res) => {
  const activity_list = req.body.activity_list;
  if( activity_list === undefined ) return res.json({
    error: true,
    mssg : "Invalid Request"
  });
  const list = JSON.parse(activity_list);

  dbo.collection(TABLE_ACTIVITY).updateMany({ _id : { $in: list }  }, { "$addToSet": { "views": req.decoded } })
    .then((err, val) => {
      console.log(err, val);
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
  const email = decoded.email;
  const channel_id = req.body.channel_id;

  dbo.collection(TABLE_CHANNELS).findOne({ _id : channel_id}, (err, result)=>{
    if(result){
      if(result.private){ /* add to requested fields */
        dbo.collection(TABLE_CHANNELS).update({ _id : channel_id }, { $addToSet: { requests : id }  }, () => {
          dbo.collection(TABLE_USERS).update({ email }, { $addToSet: { requested_channels : channel_id }  }, (err) => {
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
      } else {
        dbo.collection(TABLE_CHANNELS).update({ _id : channel_id }, { $addToSet: { followers : id }  }, () => {
          dbo.collection(TABLE_USERS).update({ email }, { $addToSet: { followed_channels : channel_id }  }, (err) => {
            if(err) 
              return res.json({
                error: true,
                mssg : err
              });
            return res.json({
              error : false,
              requested : false,
              mssg : "success"
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
  const email = decoded.email;
  const channel_id = req.body.channel_id;

  dbo.collection(TABLE_CHANNELS).findOne({ _id : channel_id}, (err, result)=>{
    if(result){
      dbo.collection(TABLE_CHANNELS).update({ _id : channel_id }, { $pull: { followers : id }  }, (err) => {
        console.log(err);
      });
      dbo.collection(TABLE_USERS).update({ email }, { $pull: { followed_channels : channel_id }  }, (err) => {
        if(err) 
          return res.json({
            error: true,
            mssg : err
          });
        return res.json({
          error : false,
          mssg : "success"
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
  * API end point to fetch details for a channel
  * Requires (TOKEN, channel_id)
  * Returns (ACKNOWLEDGEMENT, CHANNEL DATA OBJECT - CENSORED) 
*/
router.post("/channels/user/fetch-channel", verifyRequest, (req, res) => {
  const decoded = req.decoded;
  const id = decoded.id;
  let channel_id = req.body.channel_id;

  if ( channel_id === undefined ) return res.json({
    error: true,
    mssg: "invalid request"
  });
  
  dbo.collection(TABLE_CHANNELS).findOne({_id : channel_id}, (err, result) =>{
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
  * API end point to fetch event data
  * Requires (TOKEN, event_id)
  * Returns (event_data_object, UPDATES_VIEWS)
*/
router.post("/channels/user/fetch-channel-data", verifyRequest, (req, res) => {
  // console.log("FETCH CHANNEL REQUEST");
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
      // category_found : { $in : ["$category", category_list] },
      // channel_already : { $in : ["$_id", channels] },
      creator : 1,
      priority : 1,
      college: 1
    }
  };
  // const sort = { $sort : { followers : -1 }};
  const match = { $match : { _id }};
  // const limit = { $limit : parseInt(count)};

  dbo.collection(TABLE_CHANNELS).aggregate([query_data, match]).toArray( (err, result) => {
    if(err) return res.json({error : true, mssg  : err});
    return res.json({error : false, data : result});
  });
});


router.post("/channels/user/fetch-college-channels", verifyRequest, (req, res) => {
  const decoded = req.decoded;
  const id = decoded.id;
  let college = req.body.college;

  if ( college === undefined ) return res.json({
    error: true,
    mssg: "Missing Params"
  });

  const query_data =
    {
      $project: {
        _id: 1,
        name: 1,
        followers: 1,
        requests: 1,
        media : 1,
        description : 1,
        category : 1,
        creator : 1,
        priority : 1
      }
    };
  
  const match = { 
    $match: {
      $and: [
        { creator : college }
      ]
    }
  };

  dbo.collection(TABLE_CHANNELS).aggregate([query_data, match]).toArray( (err, result) => {
    if(err) return res.json({
      error: true,
      mssg: err
    });

    let output = [];
    for(var i=0; i<result.length; i++){
      let e = result[i];
      e.requests = e.requests === undefined ? [] : e.requests;
      e.followed = e.followers.includes(id);
      e.requested = e.requests.includes(id);
      e.followers = e.followers.length;
      output.push(e);
    }
    
    res.json({
      error : false,
      data : output
    });
  });
});


/*
  * API end point to fetch users for a channel
  * Requires (TOKEN, channel_id)
  * Returns (ACKNOWLEDGEMENT, CHANNEL DATA OBJECT - CENSORED) 
*/
router.post("/channels/user/fetch-channel-users", verifyRequest, (req, res) => {
  let channel_id = req.body.channel_id;

  if ( channel_id === undefined ) return res.json({
    error: true,
    mssg: "invalid request"
  });
  
  dbo.collection(TABLE_CHANNELS).findOne({_id : channel_id}, (err, result) =>{
    const followers = result.followers;
    if(err)
      return res.json({
        error : true,
        mssg : err
      });
    return res.json({
      error : false,
      data : followers
    });
  });
});

/*
  * API end point to fetch details for a channel
  * Requires (TOKEN, channel_id)
  * Returns (ACKNOWLEDGEMENT, CHANNEL DATA OBJECT - CENSORED) 
*/
router.post("/channels/user/fetch-poll-stats", verifyRequest, (req, res) => {
  const _id = req.body._id;
  dbo.collection(TABLE_ACTIVITY).findOne({_id}, (err, result) =>{
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
  * API end point to answer poll
  * Requires (TOKEN, poll_id, option)
  * Returns (ACKNOWLDGEMENT)
*/
router.post("/channels/user/answer-poll", verifyRequest, (req, res) => {
  const decoded = req.decoded;
  const id = decoded.id;
  let _id = req.body._id;
  let option = req.body.option;

  if( _id === undefined || option === undefined ) 
    return res.json({
      error: true,
      mssg: "Invalid Request"
    });

  let dope = "options."+option;
  dbo.collection(TABLE_ACTIVITY).update({ _id }, { $addToSet: { [dope] : id }  }, (err) => {
    if(err) return res.json({
      error: true,
      mssg: err
    });
    dbo.collection(TABLE_ACTIVITY).findOne({_id}, (err, result) =>{
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
});

module.exports = router;