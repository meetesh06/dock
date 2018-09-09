const express = require("express");
const actions = require("../../actions/actions");
const db = require("../../db");
const constants = require("../../constants");

const verifyUserToken = actions.verifyUserToken;
const isValidDate = actions.isValidDate;
const TABLE_USERS = constants.TABLE_USERS;
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

  dbo.collection(TABLE_CHANNELS).findOne({ _id : channel}, (err, result)=>{
    if(err){
      console.log('error', err);
      return res.json({
        error: true,
        mssg: err
      });
    } else {
      dbo.collection(TABLE_USERS).update({ email }, { $addToSet: { subscribed_channels : channel }  }, (err, result) => {
        console.log(err);
        if(err) return res.json({
          error: true,
          mssg: err
        });
        return res.json({
          error: false,
          data: result
        });
      });
    }
  });
});

module.exports = router;