/* API COLLECTIONS FOR EVENT MANAGER SIDE */
const express = require("express");
const actions = require("../../actions/actions");
const constants = require("../../constants");
const verifyManagerToken = actions.verifyManagerToken;
const isValidDate = actions.isValidDate;
const TABLE_EVENTS = constants.TABLE_EVENTS;

const db_events = require("../../db_events");
const dbo_events = db_events.getDb();


const router = express.Router();

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
  * API end point to get event list manager side
  * Requires (TOKEN, last_updated)
  * Returns (list_of_events)
*/
router.post("/events/manager/get-event-list", verifyRequest, (req, res) => {
  const decoded = req.decoded;
  const channel = decoded.channel;
  let last_updated = req.body.last_updated;

  if ( last_updated === undefined ) 
    return res.json({
      error: true,
      mssg: "invalid request"
    });

  last_updated = new Date(last_updated);
  
  const query_data =
    {
      $project: {
        _id: 1,
        name: 1,
        email: 1,
        college: 1,
        reach: { $size: "$reach" },
        views: { $size: "$views" },
        interested: { $size: "$interested" },
        enrollees_size : { $size : "$enrollees"},
        enrollees: 1,
        timestamp: 1,
        title: 1,
        description: 1,
        location: 1,
        category: 1,
        date: 1,
        contact_details: 1,
        faq: 1,
        reg_link : 1,
        audience: 1,
        media: 1,
        time: 1,
        channel_name: 1,
        channel: 1
      }
    };
  
  const match = { 
    $match: {
      $and: [ 
        { channel }
      ]
    }
  };

  if(isValidDate(last_updated)) {
    match.$match.$and.push({
      timestamp: { $gt: last_updated }
    });
  }

  dbo_events.collection(TABLE_EVENTS).aggregate([query_data, match]).toArray( (err, result) => {
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

/*
  * API end point to fetch data for and event
  * Requires (TOKEN, event_id)
  * Returns (event_data_object)
*/
router.post("/events/manager/fetch-event-data", verifyRequest, (req, res) => {
  let _id = req.body._id;

  if ( _id === undefined ) 
    return res.json({
      error: true,
      mssg: "invalid request"
    });

  const query_data =
    {
      $project: {
        _id: 1,
        email: 1,
        reach: { $size: "$reach" },
        views: { $size: "$views" },
        enrollees_size: { $size: "$enrollees" },
        interested: { $size: "$interested" },
        enrollees: 1,
        title: 1,
        description: 1,
        location: 1,
        category: 1,
        date: 1,
        contact_details: 1,
        faq: 1,
        reg_link : 1,
        audience: 1,
        media: 1,
        time: 1,
        channel_name: 1,
        timestamp: 1,
        college: 1,
        channel: 1
      }
    };
  
  const match = { 
    $match: {
      $and: [ 
        { _id }
      ]
    }
  };
  
  dbo_events.collection(TABLE_EVENTS).aggregate([query_data, match]).toArray( (err, result) => {
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