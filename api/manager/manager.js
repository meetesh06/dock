// const APP_SECRET_KEY = "KmnIIN60jZSN4wWXN52F-dope";

const express = require("express");
const actions = require("../../actions/actions");
const constants = require("../../constants");
const bodyParser = require("body-parser");
const db = require("../../db");

const dbo = db.getDb();
const router = express.Router();
const verifyManagerToken = actions.verifyManagerToken;
const TABLE_USERS_ADMIN = constants.TABLE_USERS_ADMIN;

// middlewares here
router.use(bodyParser.json()); // support json encoded bodies
router.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

// DOCUMENTATION
// Here we send the user his account bundle

// What is a account bundle ?
// The account bundle quantifies to maintain this information about the user
//  1) Latest Hashsum
//  2) List of event_ids
//  3) List of notification_ids

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
      dbo.collection(TABLE_USERS_ADMIN).findOne({
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
          } else {
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