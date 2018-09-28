/*
  * API COLLECTION FOR CHANNEL - USER SIDE
*/
const express = require("express");
const actions = require("../../actions/actions");
const db = require("../../db");
const constants = require("../../constants");

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
  * TOKEN CHECK REQUIRED
  * Requires (channel_id)
  * Returns (ACKNOWLEDGEMENT)
*/
router.post("/channels/user/follow", verifyRequest, (req, res) => {
  const decoded = req.decoded;
  const id = decoded.id;
  const email = decoded.email;
  const channel_id = req.body.channel_id;

  dbo.collection(TABLE_CHANNELS).findOne({ _id : channel_id}, (err, result)=>{
    if(result){
      dbo.collection(TABLE_CHANNELS).update({ _id : channel_id }, { $addToSet: { followers : id }  }, (err, result) => {
        console.log(err);
      });
      dbo.collection(TABLE_USERS).update({ email }, { $addToSet: { followed_channels : channel_id }  }, (err, result) => {
        if(err) 
          return res.json({
            error: true,
            mssg : err
          });
        return res.json({
          error : false,
          mssg : "done"
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
  * TOKEN CHECK REQUIRED
  * Requires (channel_id)
  * Returns (ACKNOWLEDGEMENT, CHANNEL DATA OBJECT - CENSORED) 
*/
router.post("/channels/user/fetch-channel", verifyRequest, (req, res) => {
  const decoded = req.decoded;
  const email = decoded.email;
  let channel_id = req.body.channel_id;

  if ( channel_id === undefined ) return res.json({
    error: true,
    mssg: "invalid request"
  });
  
  dbo.collection(TABLE_CHANNELS).findOne({_id : channel_id}, (err, result) =>{
    result["followed"] = result.followers.includes(email);
    result.followers = result.followers.length;
    return res.json({
      error : false,
      data : result
    });
  });
});

module.exports = router;