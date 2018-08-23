// const APP_SECRET_KEY = "KmnIIN60jZSN4wWXN52F-dope";

const express = require("express");
const router = express.Router();
const actions = require("../../actions/actions");
const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");
const db = require("../../db");
const constants = require("../../constants");

const TABLE_POSTS = constants.TABLE_POSTS;
const TABLE_POLLS = constants.TABLE_POLLS;
const verifyManagerToken = actions.verifyManagerToken;
const updateScopeAsync = actions.updateScopeAsync;
const sendToScope = actions.sendToScope;

const UID = actions.UID;

const dbo = db.getDb();

router.use(fileUpload());
router.use(bodyParser.json()); // support json encoded bodies
router.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

// Channel Route Middleware
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

//DOCUMENTATION
// CRUD Lifecycle for the channels

// Channel Roles
// 1) Creation on activity for the channels
// 2) fetching of activity for the channels

router.post("/channels/manager/create-post", verifyRequest, (req, res) => {
  const uid = UID(6);
  const decoded = req.decoded;
  console.log(req.body);
  console.log(decoded);
  // implicit
  const email = decoded.email;
  const name = decoded.name;
  // const college = decoded.college;
  const channel = decoded.channel;
  // explicit
  const message = req.body.message;
  
  if ( message === undefined )
    return res.json({
      error: true,
      mssg: "missing fields"
    });

  // generated
  const _id = channel.id + "-" + uid;
  const reach = [];
  const views = [];
  const timestamp = new Date();
  const audience = [channel.id];
  
  const query_data = {
    _id,
    reach,
    views,
    timestamp,
    audience,
    message,
    email,
    name
  };
  
  console.log(query_data);

  dbo.collection(TABLE_POSTS).insertOne(query_data, function(err) {
    if (err) {
      return res.json({
        error: true,
        mssg: "server side error"
      });
    }

    res.status(200).json({
      error: false,
      mssg: "Success"
    });

    updateScopeAsync(audience, 1);

    const payload = {
      data: {
        type: "post",
        content: JSON.stringify(query_data)
      }
    };

    sendToScope(query_data["audience"], payload);
  });
  
});
router.post("/channels/manager/create-poll", verifyRequest, (req, res) => {
  const uid = UID(6);
  const decoded = req.decoded;
  console.log(req.body);
  console.log(decoded);
  // implicit
  const email = decoded.email;
  const name = decoded.name;
  // const college = decoded.college;
  const channel = decoded.channel;
  // explicit
  const message = req.body.message;
  let options = req.body.options;
  
  if ( message === undefined || options === undefined )
    return res.json({
      error: true,
      mssg: "missing fields"
    });
  
  options = options.split(",");
  let i;
  const processedOptions = {};
  for(i=0;i<options.length;i++) {
    processedOptions[options[i].trim()] = [];
  }
  options = processedOptions;
  // generated
  const _id = channel.id + "-" + uid;
  const reach = [];
  const views = [];
  const timestamp = new Date();
  const audience = [channel.id];
  
  const query_data = {
    _id,
    reach,
    views,
    timestamp,
    audience,
    message,
    options,
    email,
    name
  };

  console.log(query_data);
  
  dbo.collection(TABLE_POLLS).insertOne(query_data, function(err) {
    if (err) {
      return res.json({
        error: true,
        mssg: "server side error"
      });
    }

    res.status(200).json({
      error: false,
      mssg: "Success"
    });

    updateScopeAsync(audience, 1);

    const payload = {
      data: {
        type: "post",
        content: JSON.stringify(query_data)
      }
    };
    sendToScope(query_data["audience"], payload);
  });
});

module.exports = router;