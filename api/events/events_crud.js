/* API COLLECTIONS FOR EVENT CRUD OPERATIONS */
const express = require("express");
const actions = require("../../actions/actions");
const db = require("../../db");
const templates = require("../../templates");
const TEMPLATE_EVENT = templates.TEMPLATE_EVENT;
const constants = require("../../constants");
const TABLE_EVENTS = constants.TABLE_EVENTS;
const bodyParser = require("body-parser");
const verifyManagerToken = actions.verifyManagerToken;
const verifyCommonToken = actions.verifyCommonToken;
const UID = actions.UID;
const saveFiles = actions.saveFiles;
const sendToScope = actions.sendToScope;
const sendEmailHtml = actions.sendEmailHtml;
const dbo = db.getDb();
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

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

/*
  * API end point to create an event
  * Requires (TOKEN, title, description, location, tags, category, reg_start, reg_end, date, time, contact_details, faq, price, available_seats)
  * Returns (ACKNOWLDEGEMENT, FIREBASE_EVENT, EMAIL)
*/
router.post("/events/manager/create", verifyRequest, (req, res) => {
  const uid = UID(12);
  const decoded = req.decoded;
  const email = decoded.email;
  const name = decoded.name;
  const college = decoded.college;
  const channel = decoded.channel;

  const _id = channel._id + "-" + uid;
  const reach = [];
  const views = [];
  const enrollees = [];
  const timestamp = new Date();
  const audience = [];

  const title = req.body.title;
  const description = req.body.description;
  const location = req.body.location;
  const category = req.body.category;
  const tags = req.body.tags;
  const reg_start = new Date(req.body.reg_start);
  const reg_end = new Date(req.body.reg_end);
  const date = new Date(req.body.date);
  const time = new Date(req.body.time);
  const contact_details = req.body.contact_details;
  const faq = req.body.faq;
  const price = req.body.price;
  const available_seats = req.body.available_seats;
  
  if( title === undefined || description === undefined || location === undefined || category === undefined || faq === undefined || tags === undefined || tags.trim() === "" || reg_start === undefined || reg_end === undefined || date === undefined || price === undefined ||contact_details === undefined || available_seats === undefined || time === undefined) {
    return res.json({
      error: true,
      mssg: "invalid request"
    });
  }

  if(!parseInt(price) === undefined)
    return res.json({
      error: true,
      mssg: "invalid request"
    });

  if(!parseInt(available_seats))
    return res.json({
      error: true,
      mssg: "invalid request"
    });
  
  if(req.files === undefined || req.files.length === 0) {
    return res.json({
      error: true,
      mssg: "invalid request, no files"
    });
  }

  audience.push(channel._id.trim());
  audience.push(category);

  const query_data = {
    email,
    name,
    college,
    _id,
    reach,
    views,
    enrollees,
    timestamp,
    title,
    description,
    location,
    category,
    tags,
    reg_start,
    reg_end,
    date,
    contact_details,
    faq,
    price,
    available_seats,
    audience,
    channel: decoded.channel._id.trim()
  };

  saveFiles(req.files, function(media, err) {
    if (err) {
      return res.json({
        error: true,
        mssg: err
      });
    } else {
      query_data["media"] = media;
      dbo.collection(TABLE_EVENTS).insertOne(query_data, function(err) {
        if (err) {
          return res.json({
            error: true,
            mssg: "server side error"
          });
        }

        res.status(200).json({
          error: false,
          mssg: "successfully created the event"
        });

        sendEventSuccessMail(email, name, _id);
        const payload = {
          data: {
            type: "event",
            content: JSON.stringify(query_data)
          },
          notification : {
            body : "Tap to know more | Dock",
            title : ""+query_data["title"]
          }
        };
        sendToScope(query_data["audience"], payload);
      });
    }
  });
});

/*
  * indexing style -- db.events.createIndex( { name: "text", college: "text", title: "text", description: "text", category: "text", channel_name: "text", tags: "text" } )
  * query style -- db.events.find( { $text: { $search: "wild" } } )
  * API end point to search available channels based on name, description and category
  * Requires (COMMON TOKEN, channel_id, last_updated)
  * Returns (results)
*/
router.post("/events/search", verifyRequestCommon, (req, res) => {
  // const decoded = req.decoded;
  let searchQuery = req.body.query;
  if( searchQuery === undefined ) return res.json({
    error: true,
    mssg: "Invalid Request"
  });
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
        score : { $meta : "textScore"},
        media: 1,
      }
    };
  const match = { $match: { $text: { $search: searchQuery } } };
  const sort = { $sort : {score : -1}};
  const limit = { $limit : 10};

  dbo.collection(TABLE_EVENTS).aggregate([match, query_data, sort, limit]).toArray( (err, result) => {
    if(err) return res.json({
      error: true,
      mssg: err
    });
    res.json({
      error: false,
      data: result
    });
  });
});


/* HELPER */
function sendEventSuccessMail(reciever, name, id) {
  const html = {
    content: TEMPLATE_EVENT(name, id)
  };
  var subject = "Successfully created a new Event | Dock";
  sendEmailHtml(reciever, subject, html.content);
}

module.exports = router;