/* API COLLECTION FOR CHANNEL - USER SIDE */
const express = require("express");
const actions = require("../../actions/actions");
const db = require("../../db");
const constants = require("../../constants");
const TABLE_ACTIVITY = constants.TABLE_ACTIVITY;
const verifyUserToken = actions.verifyUserToken;
const TABLE_USERS = constants.TABLE_USERS;
const TABLE_CHANNELS = constants.TABLE_CHANNELS;
const dbo = db.getDb();
const router = express.Router();

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
      dbo.collection(TABLE_CHANNELS).update({ _id : channel_id }, { $addToSet: { followers : id }  }, (err, res1) => {
        console.log(err);
      });
      dbo.collection(TABLE_USERS).update({ email }, { $addToSet: { followed_channels : channel_id }  }, (err, res2) => {
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
      dbo.collection(TABLE_CHANNELS).update({ _id : channel_id }, { $pull: { followers : id }  }, (err, result) => {
        console.log(err);
      });
      dbo.collection(TABLE_USERS).update({ email }, { $pull: { followed_channels : channel_id }  }, (err, result) => {
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
    result["followed"] = result.followers.includes(id);
    result.followers = result.followers.length;
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
  dbo.collection(TABLE_ACTIVITY).update({ _id }, { $addToSet: { [dope] : id }  }, (err, result) => {
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