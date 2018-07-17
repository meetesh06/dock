const APP_SECRET_KEY = "KmnIIN60jZSN4wWXN52F-dope";

const express = require("express");
const jwt = require("jsonwebtoken");
const actions = require("../../actions/actions");

const verifyManagerToken = actions.verifyManagerToken;
const verifyTempToken = actions.verifyTempToken;
const verifyUserToken = actions.verifyUserToken;

// DOCUMENTATION
// Here we take care of the creation of the CRUD of the events  

// Everything About using these routes
//
// All the token verification here are strictly done using permnent tokens.
//
// 1) /events/create -> 
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
  var token = req.headers["x-access-token"];
  if (!token) return req.eventAuth = false;
  jwt.verify(token, APP_SECRET_KEY, function(err, decoded) {
    if (err) return req.eventAuth = false;
    if ( decoded && decoded.temp === true ) return callback(false, decoded);
    if ( decoded && decoded.manager === true ) return callback(false, decoded);
    return callback(true);
  });
  next();
};

router.use(verifyRequest);

// Event Creation

router.post("/events/create", (req, res) => {
  console.log(req.eventAuth);
  // let creator_name = decoded.name;
  // let creator_email = decoded.email;
  // let belongs_to = decoded.college;
  // let event_id = creator_name + "-" + UID(6);
  let event_title = req.body.name;
  let event_description = req.body.description;
  let event_start = new Date(req.body.start);
  let event_end = new Date(req.body.end);

  let event_venue = req.body.venue;
  let event_team = req.body.team;
  let event_category = req.body.category;
  let event_tags = req.body.tags;

  let event_c1_name = req.body.c1_name;
  let event_c1_phone = req.body.c1_phone;
  let event_c2_name = req.body.c2_name;
  let event_c2_phone = req.body.c2_phone;
  let event_c3_name = req.body.c3_name;
  let event_c3_phone = req.body.c3_phone;

  let event_other_details = {
    event_coordinator_names: event_c1_name + "," + event_c2_name + "," + event_c3_name,
    event_coordinator_contact: event_c1_phone + "," + event_c2_phone + "," + event_c3_phone
  };

  let event_audience = req.body.audience;
  let timestamp = new Date();
  let creation_time = Date.now();

  const queryData = {
    // creator_name,
    // creator_email,
    // belongs_to,
    // event_id,
    event_title,
    event_description,
    event_start,
    event_end,
    event_venue,
    event_team,
    event_category,
    event_tags,
    event_other_details,
    timestamp,
    creation_time,
    event_audience,
    audience_processed: event_audience.split(","),
    event_reach: [],
    event_views: [],
    event_enrollees: []
  };

  // saveFiles(req.files ? req.files : [], function(media, err) {
  //   if (err)
  //     res.sendStatus(403);
  //   else {
  //     queryData["event_media"] = media;
  //     saveEventToDB(queryData, function(err) {
  //       if (err) return res.sendStatus(403);
  //       console.log("new event created", queryData[event_id]);
  //       res.status(200).json({
  //         error: false
  //       });

  //       const payload = {
  //         data: {
  //           type: "event",
  //           content: JSON.stringify(queryData)
  //         }
  //       };
  //       sendToScope(queryData["audience_processed"], payload, function(err) {
  //         if (!err)
  //           console.log("sending to scope for event request");
  //       });
  //     });
  //   }
  // });
});

module.exports = router;