/*  API COLLECTIONS FOR MANAGER ROUTES */
const express = require("express");
const actions = require("../../actions/actions");
const constants = require("../../constants");
const bodyParser = require("body-parser");
const router = express.Router();
const verifyManagerToken = actions.verifyManagerToken;
const TABLE_USERS_ADMIN = constants.TABLE_USERS_ADMIN;

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

// const db_static = require("../../db_static");
// const dbo_static = db_static.getDb();

const db_users = require("../../db_users");
const dbo_users = db_users.getDb();

// const db_diag = require("../../db_diag");
// const dbo_diag = db_diag.getDb();

// const db_activities = require("../../db_activities");
// const dbo_activities = db_activities.getDb();

// const db_events = require("../../db_events");
// const dbo_events = db_events.getDb();

// const db_notifications = require("../../db_notifications");
// const dbo_notifications = db_notifications.getDb();


/*
  * API end point to get latest bundle for manager
  * Requires (TOKEN, hash)
  * Returns (NEW BUNDLE)
*/
router.post("/manager/get-latest-bundle", (req, res) => {
  if (!req.body) return res.json({
    error: true,
    mssg: "missing fields"
  });
  const hash = req.body.hash;
  if ( hash === undefined ) {
    return res.json({
      error: true,
      mssg: "missing fields"
    });
  }
  verifyManagerToken(req, (err, decoded) => {
    if(err) {
      return res.json({
        error: true,
        mssg: "Token Verification failed."
      });
    } else {
      dbo_users.collection(TABLE_USERS_ADMIN).findOne({
        email: decoded.email
      }, function(err, data) {
        if (err) {
          return res.json({
            error: true,
            mssg: "Unknown error occured"
          });
        } else {
          if(data && data.hash !== undefined ) {
            if(data.hash === hash) {
              return res.json({
                error: false,
                latest: true
              });
            } else {
              return res.json({
                error: false,
                latest: false,
                bundle: {
                  hash: data.hash,
                  events: data.events !== undefined ? data.events : [],
                  notifications: data.notifications !== undefined ? data.notifications : [],
                }
              });
            }
          } 
          else {
            return res.json({
              error: true,
              mssg: "Unknown error occured"
            });
          }       
        }
      });
    }
  });
});

module.exports = router;