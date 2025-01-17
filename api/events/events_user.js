/* API COLLECTIONS FOR EVENT USER SIDE */
const express = require("express");
const actions = require("../../actions/actions");
const constants = require("../../constants");
const verifyAnonymousToken = actions.verifyAnonymousToken;
const isValidDate = actions.isValidDate;
const TABLE_EVENTS = constants.TABLE_EVENTS;
const TABLE_USERS = constants.TABLE_USERS;
const TABLE_TREDNING_EVENTS = constants.TABLE_TRENDING_EVENTS;
const router = express.Router();
const db_users = require("../../db_users");
const dbo_users = db_users.getDb();
const db_events = require("../../db_events");
const dbo_events = db_events.getDb();


/* HELPER */
const verifyRequest = function (req, res, next) {
  verifyAnonymousToken(req, (err, decoded) => {
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
  * API end point to get event list
  * Requires (TOKEN, last_updated)
  * Return (list_events, UPDATES_REACH)
*/
router.post("/events/user/get-event-list", verifyRequest, (req, res) => {
  const decoded = req.decoded;
  const college = decoded.college;
  const id = decoded.id;
  
  let last_updated = req.body.last_updated;

  if ( last_updated === undefined ) return res.json({
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
        enrollees: 1,
        timestamp: 1,
        title: 1,
        channel : 1, 
        channel_name : 1, 
        description: 1,
        location: 1,
        category: 1,
        reg_link: 1,
        date: 1,
        time: 1,
        contact_details: 1,
        faq: 1,
        audience: 1,
        media: 1,
      }
    };
  
  let d = new Date();
  d.setHours(0,0,0,0);
  const match = { 
    $match: {
      $and: [
        { college },
        { date: { $gt: d } }
      ]
    }
  };

  if(isValidDate(last_updated)) {
    match.$match.$and.push({
      timestamp: { $gt: last_updated }
    });
  }

  dbo_events.collection(TABLE_EVENTS).aggregate([query_data, match]).toArray( (err, result) => {
    console.log(err, result);
    if(err) return res.json({
      error: true,
      mssg: err
    });
    let output = [];
    for(var i=0; i< result.length; i++){
      let e = result[i];
      e.enrolled = e.enrollees.includes(id);
      e.enrollees = e.enrollees.length;
      output.push(e);
    }

    res.json({
      error: false,
      data: output
    });

    const event_list = result.map(a => a._id);
    if(event_list.length === 0) return;

    dbo_events.collection(TABLE_EVENTS).updateMany(
      { _id: { $in: event_list } },
      { $addToSet: { "reach" : { id, timestamp: new Date() } } }
    );
  });
});

/*
  * API end point to enroll user to event
  * Requires (TOKEN, event_id)
  * Returns (event_data_object, UPDATES_VIEWS)
*/
router.post("/events/user/enroll", verifyRequest, (req, res) => {
  
  const decoded = req.decoded;
  let _id = req.body._id;
  
  let name = req.body.name;
  let email = req.body.email;
  let phone = req.body.phone;
  
  if ( _id === undefined || name === undefined || email === undefined || phone === undefined ) return res.json({
    error: true,
    mssg: "missing fields"
  });

  dbo_events.collection(TABLE_EVENTS).update({ _id },{ $addToSet: { "enrollees" : { decoded, name, email, phone } } }, (err) => {
    if(err) return res.json({
      error: true,
      mssg: err
    });
    dbo_users.collection(TABLE_USERS).update({ _id : decoded.id }, { $addToSet: { registered_events : _id }  }, (err) => {
      if(err) return res.json({
        error: true,
        mssg: err
      });
      return res.json({
        error: false
      });
    });
  });
});

/*
  * API end point to add interested user to event
  * Requires (TOKEN, event_id)
  * Returns (event_data_object, UPDATES_VIEWS)
*/
router.post("/events/user/interested", verifyRequest, (req, res) => {
  const decoded = req.decoded;
  let _id = req.body._id;
  if ( _id === undefined ) return res.json({
    error: true,
    mssg: "missing fields"
  });

  dbo_events.collection(TABLE_EVENTS).update(
    { _id },
    { $addToSet: { "interested" : { decoded } } }, (err) => {
      if(err) return res.json({
        error: true,
        mssg: err
      });
      res.json({
        error: false
      });
    });
});

router.post("/events/user/fetch-trending", verifyRequest, (req, res) => {
  const query_data =
    {
      $project: {
        _id: 1,
        title: 1,
        channel : 1, 
        date: 1,
        media: 1,
        validity : 1,
        channel_name: 1,
        college: 1
      }
    };
  const match = { $match : { validity : { $gte : new Date()}}};
  dbo_events.collection(TABLE_TREDNING_EVENTS).aggregate([query_data, match]).toArray((err, result)=>{
    if(err){
      return res.json({
        error : true,
        mssg : err
      });
    }
    return res.json({
      error : false,
      data : result
    });
  });
});

/*
  * API end point to fetch event data
  * Requires (TOKEN, event_id)
  * Returns (event_data_object, UPDATES_VIEWS)
*/
router.post("/events/user/fetch-event-data", verifyRequest, (req, res) => {
  const decoded = req.decoded;
  const id = decoded.id;

  let _id = req.body._id;

  if ( _id === undefined ) return res.json({
    error: true,
    mssg: "missing fields"
  });

  const query_data =
    {
      $project: {
        _id: 1,
        email: 1,
        reach: { $size: "$reach" },
        views: { $size: "$views" },
        enrollees: 1,
        title: 1,
        time: 1,
        timestamp: 1,
        channel : 1, 
        description: 1,
        location: 1,
        category: 1,
        date: 1,
        contact_details: 1,
        faq: 1,
        audience: 1,
        media: 1,
        reg_link: 1,
        channel_name: 1,
        college: 1,
        name: 1
      }
    };
  const match = { 
    $match: {
      $and: [ 
        { _id }
      ]
    }
  };

  dbo_events.collection(TABLE_EVENTS).update(
    { _id },
    { $addToSet: { "views" : { decoded } } }
  );
  
  dbo_events.collection(TABLE_EVENTS).aggregate([query_data, match]).toArray( (err, result) => {
    if(err) return res.json({
      error: true,
      mssg: err
    });
    if(result.length > 0){
      let e = result[0];
      e.enrolled = e.enrollees.includes(id);
      e.enrollees = e.enrollees.length;
      let output = [];
      output.push(e);
      return res.json({
        error: false,
        data: output
      });
    } else {
      return res.json({
        error: true,
        mssg : "No such event found"
      });
    }
  });
});

module.exports = router;