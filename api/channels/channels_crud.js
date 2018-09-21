// const APP_SECRET_KEY = "KmnIIN60jZSN4wWXN52F-dope";

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
const verifyCommonToken = actions.verifyCommonToken;
const updateScopeAsync = actions.updateScopeAsync;
const sendToScope = actions.sendToScope;
const isValidDate = actions.isValidDate;
const saveFiles = actions.saveFiles;

const UID = actions.UID;

const dbo = db.getDb();

// router.use(fileUpload());
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

//DOCUMENTATION
// CRUD Lifecycle for the channels

// Channel Roles
// 1) Creation on activity for the channels
// 2) fetching of activity for the channels

// Everything About using these routes
//
// All the token verification here are strictly done using permnent tokens.
//
// 1) /channels/get-activity -> 
//  expects: 
//    1) last_updated - "String"
//  replies:
//    1) error - boolean
//    2) mssg - string / data - JSON
//
// 2) /channels/manager/create-post -> 
//  expects: 
//    1) message - "String"
//  replies:
//    1) error - boolean
//    2) mssg - string
//
// 3) /channels/manager/create-image-post -> 
//  expects: 
//    1) message - "String"
//    2) image - multipart/formdata
//  replies:
//    1) error - boolean
//    2) mssg - string
//
// 4) /channels/manager/create-poll -> 
//  expects: 
//    1) message - "String"
//    2) OPTIONS - "String" (COMMA SEPERATED)
//  replies:
//    1) error - boolean
//    2) mssg - string
//
// 5) /channels/make-poll -> 
//  expects: 
//    1) _id - "String"
//    1) option - "String"
//  replies:
//    1) error - boolean
//    2) mssg - string
//

router.post("/channels/get-activity", verifyRequestCommon, (req, res) => {
  const decoded = req.decoded;
  let channel = req.body.channel;
  // bypass for manager
  if(decoded.manager === true) channel = decoded.channel.id;
  // conditional
  if( channel === undefined ) return res.json({
    error: true,
    mssg: "Invalid Request"
  });

  // explicit
  let last_updated = req.body.last_updated;

  if ( last_updated === undefined ) return res.json({
    error: true,
    mssg: "invalid request"
  });
  
  last_updated = new Date(last_updated);
  
  const query_data = {
    channel,
  };

  if(isValidDate(last_updated)) {
    query_data["timestamp"] = {
      $gt: last_updated
    };
  }
  console.log(query_data);
  dbo.collection(TABLE_ACTIVITY).find(query_data)
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
  const type = "post";
  const timestamp = new Date();
  const audience = [channel.id];
  
  const query_data = {
    _id,
    reach,
    views,
    type,
    timestamp,
    channel: channel.id,
    audience,
    message,
    email,
    name
  };
  
  console.log(query_data);

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
router.post("/channels/manager/create-image-post", verifyRequest, (req, res) => {
  const uid = UID(6);
  const decoded = req.decoded;
  // console.log(req.body);
  // console.log(req);
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
  const type = "post-image";
  const timestamp = new Date();
  const audience = [channel.id];
  
  const query_data = {
    _id,
    reach,
    views,
    type,
    timestamp,
    channel: channel.id,
    audience,
    message,
    email,
    name
  };
  
  console.log(query_data);
  console.log(req.files);

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
  if(options.length < 2) 
    return res.json({
      error: true,
      mssg: "Invalid Data"
    });
  // generated
  const _id = channel.id + "-" + uid;
  const reach = [];
  const views = [];
  const type = "poll";
  const timestamp = new Date();
  const audience = [channel.id];
  
  const query_data = {
    _id,
    reach,
    views,
    type,
    timestamp,
    channel: channel.id,
    audience,
    message,
    options,
    email,
    name
  };

  console.log(query_data);
  
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
router.post("/channels/make-poll", verifyRequestCommon, (req, res) => {
  console.log(req.body);
  const decoded = req.decoded;
  // explicit
  let _id = req.body._id;
  let option = req.body.option;

  // implicit
  const email = decoded.email;

  // conditional
  if( _id === undefined || option === undefined ) return res.json({
    error: true,
    mssg: "Invalid Request"
  });

  let dope = "options."+option;
  dbo.collection(TABLE_ACTIVITY).update({ _id }, { $addToSet: { [dope] : email }  }, (err, result) => {
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

router.post("/channels/manager/get-member-list", verifyRequest, (req, res) => {
  // implicit
  const decoded = req.decoded;
  const channel = decoded.channel.id;
  // explicit
  let last_updated = req.body.last_updated;

  if ( last_updated === undefined ) return res.json({
    error: true,
    mssg: "invalid request"
  });
  
  last_updated = new Date(last_updated);
  
  const query_data = {
    "channel.id": channel,
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
    console.log(result);
    return res.json({
      error: false,
      data: result
    });
  });
});
router.post("/channels/manager/add-member", verifyRequest, (req, res) => {
  const decoded = req.decoded;
  // implicit
  const channel = decoded.channel;
  const college = decoded.college;
  // explicit
  const email = req.body.email;
  const password = req.body.password;
  const name = req.body.name;
  // generated
  const timestamp = new Date();
  const activated = false;
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