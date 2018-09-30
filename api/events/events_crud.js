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

  const _id = channel.id + "-" + uid;
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

  audience.push(channel.id.trim());
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
    channel: decoded.channel.id.trim()
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

/* HELPER */
function sendEventSuccessMail(reciever, name, id) {
  const html = {
    content: TEMPLATE_EVENT(name, id)
  };
  var subject = "Successfully created a new Event | Dock";
  sendEmailHtml(reciever, subject, html.content);
}

module.exports = router;