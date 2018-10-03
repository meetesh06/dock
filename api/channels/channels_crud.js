/* API COLLECTION FOR CHANNEL CRUD OPERATIONS */
const express = require("express");
const router = express.Router();
const actions = require("../../actions/actions");
const bodyParser = require("body-parser");
const db = require("../../db");
const constants = require("../../constants");
const TABLE_ACTIVITY = constants.TABLE_ACTIVITY;
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
  * API end point for getting ativity list
  * Requires (TOKEN, channel_id, last_updated)
  * Returns (activity_list_based_on_last_update)
*/
router.post("/channels/get-activity-list", verifyRequestCommon, (req, res) => {
  const decoded = req.decoded;
  let channel_id = req.body.channel_id;

  if(decoded.manager === true) channel_id = decoded.channel._id;
  if( channel_id === undefined ) return res.json({
    error: true,
    mssg: "Invalid Request"
  });

  let last_updated = req.body.last_updated;
  if ( last_updated === undefined ) return res.json({
    error: true,
    mssg: "invalid request"
  });
  
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
      if(err) 
        return res.json({
          error: true,
          mssg: err
        });
      console.log(result);
      for(var i=0; i< result.length; i++){
        if(result[i].type === "poll"){
          let tup = result[i];
          tup.options = Object.keys(tup.options);
          result[i] = tup;
        }
      }
      return res.json({
        error: false,
        data: result
      });
    });
});

/*
  * API end point to answer poll
  * Requires (TOKEN, poll_id, option)
  * Returns (ACKNOWLDGEMENT)
*/
router.post("/channels/answer-poll", verifyRequestCommon, (req, res) => {
  const decoded = req.decoded;
  const email = decoded.email;

  let _id = req.body._id;
  let option = req.body.option;

  if( _id === undefined || option === undefined ) 
    return res.json({
      error: true,
      mssg: "Invalid Request"
    });

  let dope = "options."+option;
  dbo.collection(TABLE_ACTIVITY).update({ _id }, { $addToSet: { [dope] : email }  }, (err, result) => {
    if(err) return res.json({
      error: true,
      mssg: err
    });
    console.log(result);
    return res.json({
      error: false,
      mssg : "success"
    });
  });
});

module.exports = router;