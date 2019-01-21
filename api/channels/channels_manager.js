/* API COLLECTION FOR CHANNEL OPERATIONS MANAGER SIDE */
const express = require("express");
const router = express.Router();
const actions = require("../../actions/actions");
const bodyParser = require("body-parser");
const db = require("../../db");
const constants = require("../../constants");
const passwordHash = require("password-hash");
const TABLE_ACTIVITY = constants.TABLE_ACTIVITY;
const TABLE_USERS_ADMIN = constants.TABLE_USERS_ADMIN;
const verifyManagerToken = actions.verifyManagerToken;
const updateScopeAsync = actions.updateScopeAsync;
const sendToScope = actions.sendToScope;
const isValidDate = actions.isValidDate;
const saveFiles = actions.saveFiles;
const saveVideo = actions.saveVideo;
const UID = actions.UID;
const dbo = db.getDb();
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

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
  * API end point to create a post
  * Requires (TOKEN, post)
  * Returns (ACKNOWLEDGEMENT, FIREBASE_EVENT)
*/
router.post("/channels/manager/create-post", verifyRequest, (req, res) => {
  const uid = UID(12);
  const decoded = req.decoded;
  const email = decoded.email;
  const name = decoded.name;
  const channel = decoded.channel;
  const category = channel.category;
  const channel_name = channel.name;
  const message = req.body.message;
  
  if ( message === undefined )
    return res.json({
      error: true,
      mssg: "missing fields"
    });

  const _id = channel._id + "-" + uid;
  const reach = [];
  const views = [];
  const type = "post";
  const timestamp = new Date();
  const audience = [channel._id];
  
  const query_data = {
    _id,
    reach,
    views,
    type,
    timestamp,
    channel: channel._id,
    audience,
    category,
    channel_name,
    message,
    email,
    name
  };

  dbo.collection(TABLE_ACTIVITY).insertOne(query_data, function(err) {
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
      },
      notification : {
        body : "Tap to know more | Dock",
        title : ""+query_data["message"]
      }
    };
    sendToScope(query_data["audience"], payload);
  });
});

/*
  * API end point to create an image post
  * Requires (TOKEN, message, image)
  * Returns (ACKNOWLEDGEMENT, FIREBASE_EVENT)
*/
router.post("/channels/manager/create-image-post", verifyRequest, (req, res) => {
  const uid = UID(12);
  const decoded = req.decoded;
  const email = decoded.email;
  const name = decoded.name;
  const channel = decoded.channel;

  const message = req.body.message;
  
  if ( message === undefined )
    return res.json({
      error: true,
      mssg: "missing fields"
    });

  const _id = channel._id + "-" + uid;
  const reach = [];
  const views = [];
  const type = "post-image";
  const timestamp = new Date();
  const audience = [channel._id];
  
  const query_data = {
    _id,
    reach,
    views,
    type,
    timestamp,
    channel: channel._id,
    audience,
    message,
    email,
    name
  };

  if(req.files === undefined || req.files === null || req.files.length === 0) {
    return res.json({
      error: true,
      mssg: "invalid request, no files"
    });
  }

  saveFiles(req.files, function(media, err) {
    if (err) {
      return res.json({
        error: true,
        mssg: err
      });
    } else {
      query_data["media"] = media;
      dbo.collection(TABLE_ACTIVITY).insertOne(query_data, function(err) {
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
          },
          notification : {
            body : "Tap to know more | Dock",
            title : ""+query_data["message"]
          }
        };
        sendToScope(query_data["audience"], payload);
      });
    }
  });
});

/*
  * API end point to create an video post
  * Requires (TOKEN, message, video)
  * Returns (ACKNOWLEDGEMENT, FIREBASE_EVENT)
*/
router.post("/channels/manager/create-video-post", verifyRequest, (req, res) => {
  const uid = UID(12);
  const decoded = req.decoded;
  const email = decoded.email;
  const name = decoded.name;
  const channel = decoded.channel;

  const message = req.body.message;
  
  if ( message === undefined )
    return res.json({
      error: true,
      mssg: "missing fields"
    });

  const _id = channel._id + "-" + uid;
  const reach = [];
  const views = [];
  const type = "post-video";
  const timestamp = new Date();
  const audience = [channel._id];
  
  const query_data = {
    _id,
    reach,
    views,
    type,
    timestamp,
    channel: channel._id,
    audience,
    message,
    email,
    name
  };

  if(req.files === undefined || req.files === null || req.files.length === 0) {
    return res.json({
      error: true,
      mssg: "invalid request, no files"
    });
  }
  if(req.files.file === undefined) return res.json({
    error: true,
    mssg: "invalid request, no files"
  });
  console.log(req.files);
  saveVideo(req.files.file, function(err, filename) {
    if (err) {
      return res.json({
        error: true,
        mssg: err
      });
    } else {
      query_data["media"] = filename;
      dbo.collection(TABLE_ACTIVITY).insertOne(query_data, function(err) {
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
          },
          notification : {
            body : "Tap to know more | Dock",
            title : ""+query_data["message"]
          }
        };
        sendToScope(query_data["audience"], payload);
      });
    }
  });
});

/*
  * API end point to create a poll
  * Requires (TOKEN, message, options_CSV, poll_type)
  * return (ACKNOWLEDGEMENT, FIREBASE_EVENT)
*/
router.post("/channels/manager/create-poll", verifyRequest, (req, res) => {
  const uid = UID(12);
  const decoded = req.decoded;
  const email = decoded.email;
  const name = decoded.name;
  const channel = decoded.channel;

  const message = req.body.message;
  const poll_type = req.body.poll_type;
  let options = req.body.options;
  
  if ( message === undefined || options === undefined || poll_type === undefined)
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
  if(options.length < 2) 
    return res.json({
      error: true,
      mssg: "Invalid Data"
    });
  const _id = channel._id + "-" + uid;
  const reach = [];
  const views = [];
  const type = "poll";
  const timestamp = new Date();
  const audience = [channel._id];
  
  const query_data = {
    _id,
    reach,
    views,
    type,
    timestamp,
    channel: channel._id,
    audience,
    message,
    poll_type,
    options,
    email,
    name
  };
  
  dbo.collection(TABLE_ACTIVITY).insertOne(query_data, function(err) {
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
      },
      notification : {
        body : "Tap to know more | Dock",
        title : ""+query_data["message"]
      }
    };
    
    sendToScope(query_data["audience"], payload);
  });
});

/*
  * API end point to get a list of admin members of a channel
  * Requires (TOKEN, last_updated)
  * Returns (list_members)
*/
router.post("/channels/manager/get-member-list", verifyRequest, (req, res) => {
  const decoded = req.decoded;
  const channel = decoded.channel._id;
  let last_updated = req.body.last_updated;

  if ( last_updated === undefined ) return res.json({
    error: true,
    mssg: "invalid request"
  });
  
  last_updated = new Date(last_updated);
  
  const query_data = {
    "channel._id": channel,
  };

  if(isValidDate(last_updated)) {
    query_data["timestamp"] = {
      $gt: last_updated
    };
  }
  
  dbo.collection(TABLE_USERS_ADMIN).find(query_data).toArray( (err, result) => {
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
  * API end point to add a new admin member to a channel
  * Requires (TOKEN, email, password, name)
  * Returns (DATA)
*/
router.post("/channels/manager/add-member", verifyRequest, (req, res) => {
  const decoded = req.decoded;
  const channel = decoded.channel;
  const college = decoded.college;

  const email = req.body.email;
  const password = req.body.password;
  const name = req.body.name;

  const timestamp = new Date();

  if( email === undefined || password === undefined || name === undefined ) return res.json({
    error: true,
    mssg: "Invalid Request"
  });

  const generated_password = passwordHash.generate(password);
  dbo.collection(TABLE_USERS_ADMIN).insertOne({ 
    email, 
    password: generated_password,
    name,
    college,
    channel,
    timestamp
  }, (err, result) => {
    if(err) 
      return res.json({
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