/* API COLLECTION FOR CHANNEL CRUD OPERATIONS */
const express = require("express");
const router = express.Router();
const actions = require("../../actions/actions");
const bodyParser = require("body-parser");
const constants = require("../../constants");

const TABLE_NOTIFICATIONS = constants.TABLE_NOTIFICATIONS;
const verifyManagerToken = actions.verifyManagerToken;
const sendToScope = actions.sendToScope;
const UID = actions.UID;

// const db_static = require("../../db_static");
// const dbo_static = db_static.getDb();

// const db_users = require("../../db_users");
// const dbo_users = db_users.getDb();

// const db_diag = require("../../db_diag");
// const dbo_diag = db_diag.getDb();

// const db_activities = require("../../db_activities");
// const dbo_activities = db_activities.getDb();

// const db_events = require("../../db_events");
// const dbo_events = db_events.getDb();

const db_notifications = require("../../db_notifications");
const dbo_notifications = db_notifications.getDb();


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
  * API end point to get top channels based on the cateogry of intersts user likes.
  * Requires (COMMON TOKEN, category_array, already_subscribed_channels, count)
  * Returns (results)
*/
router.post("/notifications/manager/create", verifyRequest, (req, res) => {
  const uid = UID(16);
  const decoded = req.decoded;

  const message = req.body.message;
  const type = req.body.type;
  const audience = req.body.audience;
  const timestamp = new Date();
  
  if (
    message === undefined ||
    type === undefined ||
    audience === undefined
  ) return res.json({
    error: true,
    mssg: "missing fields"
  });

  const query_data = {
    _id: uid,
    decoded,
    message,
    type,
    audience,
    timestamp
  };

  dbo_notifications.collection(TABLE_NOTIFICATIONS).insertOne(query_data, function(err) {
    if (err) {
      return res.json({
        error: true,
        mssg: "server side error"
      });
    }

    res.status(200).json({
      error: false,
      mssg: "Success"
    });

    const payload = {
      data: {
        type,
        content: JSON.stringify(query_data)
      },
      notification : {
        body : "New updates in Event",
        title : ""+query_data["message"]
      }
    };
    
    sendToScope([query_data["audience"]], payload);

  });


});

module.exports = router;