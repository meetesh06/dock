const express = require("express");
const actions = require("../../actions/actions");
const db = require("../../db");
const constants = require("../../constants");

const verifyUserToken = actions.verifyUserToken;
// const isValidDate = actions.isValidDate;
const TABLE_USERS = constants.TABLE_USERS;
const TABLE_CHANNELS = constants.TABLE_CHANNELS;
const dbo = db.getDb();

// DOCUMENTATION

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

router.post("/channels/user/susbcribe", verifyRequest, (req, res) => {
  const decoded = req.decoded;
  const email = decoded.email;
  const channel = req.body.channel;

  console.log(channel);
  dbo.collection(TABLE_CHANNELS).findOne({ _id : channel}, (err, result)=>{
    if(result){
      dbo.collection(TABLE_CHANNELS).update({ _id : channel }, { $addToSet: { subscribers : email }  }, (err, result) => {
        console.log(err);
      });
      dbo.collection(TABLE_USERS).update({ email }, { $addToSet: { subscribed_channels : channel }  }, (err, result) => {
        console.log(err);
        return res.json({
          error: err
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

router.post("/channels/user/fetch-channel", verifyRequest, (req, res) => {
  const decoded = req.decoded;
  const email = decoded.email;
  let _id = req.body.channel;

  if ( _id === undefined ) return res.json({
    error: true,
    mssg: "invalid request"
  });
  
  dbo.collection(TABLE_CHANNELS).findOne({_id}, (err, result) =>{
    result['subscribed'] = result.subscribers.includes(email);
    result.subscribers = result.subscribers.length;
    return res.json({
      error : false,
      data : result
    });
  });
});


router.post("/channels/user/check-subscribed", verifyRequest, (req, res) => {
  const decoded = req.decoded;
  const email = decoded.email;
  const channel = req.body.channel;
  dbo.collection(TABLE_CHANNELS).find({subscribers: { $elemMatch : email } }, (err, result)=>{
    console.log(err);
    if(err){
      console.log("error", err);
      return res.json({
        error: true,
        mssg: err
      });
    } else {
      return res.json({
        error: false,
        mssg: 'Found'
      });
    }
  });
});

module.exports = router;