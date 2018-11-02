/* API COLLECTIONS FOR EVENT USER SIDE */
const express = require("express");
const actions = require("../../actions/actions");
const db = require("../../db");
const constants = require("../../constants");
const verifyUserToken = actions.verifyUserToken;
const isValidDate = actions.isValidDate;
const TABLE_EVENTS = constants.TABLE_EVENTS;
const TABLE_USERS = constants.TABLE_USERS;
const TABLE_PAYMENTS = constants.TABLE_PAYMENTS;
const dbo = db.getDb();
const router = express.Router();
const UID = actions.UID;

/* HELPER */
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
        tags: 1,
        reg_start: 1,
        reg_end: 1,
        date: 1,
        contact_details: 1,
        faq: 1,
        price: 1,
        available_seats: 1,
        audience: 1,
        media: 1,
      }
    };
  
  const match = { 
    $match: {
      $and: [ 
        { college }
      ]
    }
  };

  if(isValidDate(last_updated)) {
    match.$match.$and.push({
      timestamp: { $gt: last_updated }
    });
  }

  dbo.collection(TABLE_EVENTS).aggregate([query_data, match]).toArray( (err, result) => {
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

    dbo.collection(TABLE_EVENTS).updateMany(
      { _id: { $in: event_list } },
      { $addToSet: { "reach" : { id, timestamp: new Date() } } }
    );
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
        channel : 1, 
        description: 1,
        location: 1,
        category: 1,
        tags: 1,
        reg_start: 1,
        reg_end: 1,
        date: 1,
        contact_details: 1,
        faq: 1,
        price: 1,
        available_seats: 1,
        audience: 1,
        media: 1,
      }
    };
  const match = { 
    $match: {
      $and: [ 
        { _id }
      ]
    }
  };

  dbo.collection(TABLE_EVENTS).update(
    { _id },
    { $addToSet: { "views" : { id, timestamp: new Date().getUTCMonth() + 1 } } }
  );
  
  dbo.collection(TABLE_EVENTS).aggregate([query_data, match]).toArray( (err, result) => {
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
      res.json({
        error: false,
        data: output
      });
    }
  });
});

/*
  * API end point to enroll user to an event
  * Requires (TOKEN, event_id)
  * Returns (ACKNOWLEDGEMENT)
*/
router.post("/events/user/purchase", verifyRequest, (req, res) => {
  const decoded = req.decoded;
  const id = decoded.id;
  const event_id = req.body._id;

  if(event_id === undefined) {
    return res.json({
      error : true,
      mssg : "Missing Fields"
    });
  }

  let purchase_id = UID(32);

  dbo.collection(TABLE_PAYMENTS).findOne({event_id, user_id : id}, (err, result) =>{
    if(err) return res.json({
      error: true,
      mssg : err
    });
    console.log(result);
    if(result) return res.json({
      error : false,
      data : result
    });

    dbo.collection(TABLE_PAYMENTS).insertOne({ _id : purchase_id, user_id : id, event_id, timestamp : new Date()}, (err)=>{
      if(err) return;
      dbo.collection(TABLE_EVENTS).update({ _id : event_id}, { $addToSet: { enrollees : id }  }, (err, result)=>{
        if(result){
          dbo.collection(TABLE_USERS).update({ _id : id }, { $addToSet: { events : event_id }  }, (err, result1) => {
            if(err)
              return res.json({
                error: true,
                mssg : err
              });
            return res.json({
              error : false,
              data : { _id : purchase_id, user_id : id, event_id, timestamp : new Date()}
            });
          });
        } else {
          return res.json({
            error: true,
            mssg: err
          });
        }
      });
    });
  });
});

/*
  * API end point to get event list of a channel
  * Requires (TOKEN, channel)
  * Returns (event_list, UPDATES_REACH)
*/
router.post("/events/user/get-channel-event-list", verifyRequest, (req, res) => {
  const decoded = req.decoded;
  const id = decoded.id;

  let channel_id = req.body.channel_id;

  if ( channel_id === undefined ) return res.json({
    error: true,
    mssg: "invalid request"
  });
    
  const query_data =
    {
      $project: {
        _id: 1,
        name: 1,
        email: 1,
        college: 1,
        channel: 1,
        reach: { $size: "$reach" },
        views: { $size: "$views" },
        enrollees: { $size: "$enrollees" },
        timestamp: 1,
        title: 1,
        description: 1,
        location: 1,
        category: 1,
        tags: 1,
        reg_start: 1,
        reg_end: 1,
        date: 1,
        contact_details: 1,
        faq: 1,
        price: 1,
        available_seats: 1,
        audience: 1,
        media: 1,
      }
    };
    
  const match = { 
    $match: {
      $and: [ 
        { channel : channel_id }
      ]
    }
  };

  dbo.collection(TABLE_EVENTS).aggregate([query_data, match]).toArray( (err, result) => {
    if(err) return res.json({
      error: true,
      mssg: err
    });
    res.json({
      error: false,
      data: result
    });
    const event_list = result.map(a => a._id);
    if(event_list.length === 0) return;
    dbo.collection(TABLE_EVENTS).updateMany(
      { _id: { $in: event_list } },
      { $addToSet: { "reach" : { id, timestamp: new Date() } } }
    );
  });
});

module.exports = router;