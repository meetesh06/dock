/*  API COLLECTIONS FOR MANAGER ROUTES */
const express = require("express");
const actions = require("../../actions/actions");
const constants = require("../../constants");
const bodyParser = require("body-parser");
const db = require("../../db");
const dbo = db.getDb();
const router = express.Router();
const verifyManagerToken = actions.verifyManagerToken;
const TABLE_USERS_ADMIN = constants.TABLE_USERS_ADMIN;

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

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