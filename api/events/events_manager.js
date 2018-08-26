// const APP_SECRET_KEY = "KmnIIN60jZSN4wWXN52F-dope";

const express = require("express");
const actions = require("../../actions/actions");
const db = require("../../db");
const constants = require("../../constants");

const verifyManagerToken = actions.verifyManagerToken;
const isValidDate = actions.isValidDate;
const TABLE_EVENTS = constants.TABLE_EVENTS;
const dbo = db.getDb();

// DOCUMENTATION
// Here we take care of the creation of the CRUD of the events  

// Everything About using these routes
//
// All the token verification here are strictly done using permnent tokens.
//
// 1) /events/user/get-event-list -> 
//  expects: 
//    1) .. event_payload
//  replies:
//    1) error - boolean
//    2) mssg - string
//  other: 
//    sends a update to the scope
//    sends a email to the creator
//

const router = express.Router();
// Event Route Middleware
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

router.post("/events/manager/get-event-list", verifyRequest, (req, res) => {
  // implicit
  const decoded = req.decoded;
  const email = decoded.email;
  // explicit
  let last_updated = req.body.last_updated;

  if ( last_updated === undefined ) return res.json({
    error: true,
    mssg: "invalid request"
  });
  
  last_updated = new Date(last_updated);
  
  const query_data = {
    email,
  };

  if(isValidDate(last_updated)) {
    query_data["timestamp"] = {
      $gt: last_updated
    };
  }
  console.log(query_data);
  dbo.collection(TABLE_EVENTS).find(query_data)
    .toArray( (err, result) => {
      if(err) return res.json({
        error: true,
        mssg: err
      });
      return res.json({
        error: false,
        data: result
      });
    });
});

module.exports = router;