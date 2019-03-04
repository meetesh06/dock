/* API COLLECTIONS FOR EVENT CRUD OPERATIONS */
const express = require("express");
const actions = require("../../actions/actions");
const templates = require("../../templates");
const TEMPLATE_EVENT = templates.TEMPLATE_EVENT;
const constants = require("../../constants");
const TABLE_EVENTS = constants.TABLE_EVENTS;
const bodyParser = require("body-parser");
const verifyManagerToken = actions.verifyManagerToken;
const UID = actions.UID;
const saveFiles = actions.saveFiles;
const sendToScope = actions.sendToScope;
const sendEmailHtml = actions.sendEmailHtml;

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

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

/*
  * API end point to create an event
  * Requires (TOKEN, title, description, location, category, date, time, contact_details, faq, reg_link, media)
  * Returns (ACKNOWLDEGEMENT, FIREBASE_EVENT, EMAIL)
*/
router.post("/events/manager/create", verifyRequest, (req, res) => {
  const uid = UID(16);
  const decoded = req.decoded;
  const email = decoded.email;
  const college = decoded.college;
  const channel = decoded.channel;
  const channel_name = decoded.channel_name;

  const _id = channel + "-" + uid;
  const reach = [];
  const views = [];
  const enrollees = [];
  const interested = [];
  const timestamp = new Date();
  const audience = [];

  const title = req.body.title;
  const description = req.body.description;
  const location = req.body.location;
  const category = req.body.category;
  const date = new Date(req.body.date);
  const time = new Date(req.body.time);
  const contact_details = req.body.contact_details;
  const faq = req.body.faq;
  const reg_link = req.body.reg_link;
  
  if (
    title === undefined ||
    description === undefined ||
    location === undefined ||
    category === undefined ||
    faq === undefined ||
    date === undefined ||
    contact_details === undefined ||
    time === undefined ||
    reg_link === undefined
  ) {
    return res.json({
      error: true,
      mssg: "invalid request 1"
    });
  }
  
  if(req.files === undefined || req.files.length === 0) {
    return res.json({
      error: true,
      mssg: "invalid request, no files"
    });
  }

  audience.push(channel.trim());
  audience.push(category);

  const query_data = {
    email,
    college,
    _id,
    reach,
    views,
    interested,
    enrollees,
    timestamp,
    title,
    description,
    location,
    category,
    channel_name,
    date,
    time,
    contact_details,
    faq,
    audience,
    channel,
    reg_link
  };

  saveFiles(req.files, function(media, err) {
    if (err) {
      return res.json({
        error: true,
        mssg: err
      });
    } else {
      query_data["media"] = media;
      dbo_events.collection(TABLE_EVENTS).insertOne(query_data, function(err) {
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

        sendEventSuccessMail(email, "Creator", _id);
        const payload = {
          data: {
            type: "event",
            content: JSON.stringify(query_data)
          },
          notification : {
            body : "Tap to know more | Campus Story",
            title : ""+query_data["title"]
          }
        };
        sendToScope(query_data["audience"], payload);
      });
    }
  });
});

/*
  * API end point to create an event
  * Requires (TOKEN, title, description, location, category, date, time, contact_details, faq, reg_link, media)
  * Returns (ACKNOWLDEGEMENT, FIREBASE_EVENT, EMAIL)
*/
router.post("/events/manager/update", verifyRequest, (req, res) => {
  const decoded = req.decoded;
  const email = decoded.email;
  const college = decoded.college;
  const channel = decoded.channel;
  const channel_name = decoded.channel_name;

  const _id = req.body._id;
  const title = req.body.title;
  const description = req.body.description;
  const location = req.body.location;
  const category = req.body.category;
  const date = new Date(req.body.date);
  const time = new Date(req.body.time);
  const contact_details = req.body.contact_details;
  const faq = req.body.faq;
  const reg_link = req.body.reg_link;
  
  if (
    title === undefined ||
    description === undefined ||
    location === undefined ||
    category === undefined ||
    faq === undefined ||
    date === undefined ||
    contact_details === undefined ||
    time === undefined ||
    reg_link === undefined
  ) {
    return res.json({
      error: true,
      mssg: "invalid request 1"
    });
  }

  const timestamp = new Date();

  const query_data = {
    email,
    college,
    _id,
    title,
    description,
    location,
    category,
    channel_name,
    date,
    timestamp,
    time,
    contact_details,
    faq,
    channel,
    reg_link
  };

  dbo_events.collection(TABLE_EVENTS).updateOne({ _id}, { $set: query_data }, (err) => {
    if (err) {
      return res.json({
        error: true,
        mssg: "server side error"
      });
    }

    return res.json({
      error: false,
      mssg: "successfully updated the event"
    });

    /* ADD NOTIFICATIONS HERE */
  
  });
});


/* HELPER */
function sendEventSuccessMail(reciever, name, id) {
  const html = {
    content: TEMPLATE_EVENT(name, id)
  };
  var subject = "Successfully created a new Event | Campus Story";
  sendEmailHtml(reciever, subject, html.content);
}

module.exports = router;