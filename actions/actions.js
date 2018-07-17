const APP_SECRET_KEY = "KmnIIN60jZSN4wWXN52F-dope";

const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const random = require("hat");
const imagemin = require("imagemin");
const imageminWebp = require("imagemin-webp");
const constants = require("../constants");
const fs = require("fs");
const admin = require("firebase-admin");
const db = require("../db");
const serviceAccount = require("./admincred.json");

const TABLE_SCOPE = constants.TABLE_SCOPE;
const MAX_RETRIES_MESSAGING = constants.MAX_RETRIES_MESSAGING;
const dbo = db.getDb();

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://mycampusdock-12f5a.firebaseio.com"
});

// Only token verification happens here, do not sign tokens here

// sendEmailHtml(reciever, subject, html, callback)

// There are three type of tokens
//  1) Temporary - { temp: true }
//  2) Manager - { manager: true }
//  1) User - { user: true }

const smtpTransport = nodemailer.createTransport({
  host: "sg1-ls1.a2hosting.com", // this domain for all TLS communication with server services
  port: 465,
  secure: true,
  auth: {
    user: "support@mycampusdock.com",
    pass: "D@ckD@ck"
  }
});

exports.sendEmailHtml = function(reciever, subject, html, callback) {
  var mailOptions = {
    from: "\"Campus Dock\" <support@mycampusdock.com>",
    to: reciever,
    subject: subject,
    html
  };
  smtpTransport.sendMail(mailOptions, function(error) {
    callback(error);
  });
};

const UID_func = function(length) {
  var text = "";
  var possible = "0123456789ABCDEFGHIJKLMNO8PQRSTUVWXYZabcd8efghijklmnopqrstuvwxyz0123456789";
  for (var i = 0; i < length; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  return text;
};

exports.UID = UID_func;

exports.saveFiles = function(files, callback) {
  var media = [];
  let err = false;
  let toCompress = [];
  Object.entries(files).forEach(([key, value]) => {
    var filename = random() + key + "-" + value.name;
    var loc = __dirname + "/media/" + filename;
    toCompress.push(new Promise((resolve, reject) => {
      value.mv(loc, function(err) {
        if (err) {
          return reject("reject");
        } else {
          imagemin([loc], __dirname + "/media/", {
            plugins: [
              imageminWebp({quality: 50})
            ]
          }).then(files => {
            media.push(files[0].path.split("/")[files[0].path.split("/").length - 1]);
            resolve("resolve");
          }).catch(err => {
            console.log(err);
            return reject("reject");
          }).then( () => {
            fs.unlink(loc, ()=> {
              console.log("file delete async done");
            });
          });
        }
      });
    }));
  });
  Promise.all(toCompress).then(function() {
    callback(media, null);
  }, function() {
    console.log(err);
    return callback(null, true);
  });
};

exports.updateScopeAsync = function(audience, type) {
  let i;
  // 0 - event
  // 1 - bulletin
  // 2 - notification
  let current_hash = "d_hash";
  switch (type) {
  case 0:
    current_hash = "event_hash";
    break;
  case 1:
    current_hash = "bulletin_hash";
    break;
  case 2:
    current_hash = "notification_hash";
    break;
  default:
    return;
  }
  let params = {};
  params[current_hash] = UID_func(20);
  for (i = 0; i < audience.length; i++) {
    dbo.collection(TABLE_SCOPE).update({
      name: audience[i]
    }, {
      $set: params
    }, {
      upsert: true
    });
  }
};

exports.sendToScope = function(scopeArray, payload) {
  let currentQueue = [...scopeArray];
  let i = 0;
  console.log(currentQueue);
  for (i = 0; i < currentQueue.length; i++) {
    sendToIndividual(currentQueue[i], payload, 0);
  }
};

exports.verifyTempToken = function(req, callback) {
  var token = req.headers["x-access-token"];
  if (!token) return callback(true);
  jwt.verify(token, APP_SECRET_KEY, function(err, decoded) {
    if (err) return callback(true);
    if ( decoded && decoded.temp === true ) return callback(false, decoded);
    return callback(true);
  });
};

exports.verifyManagerToken = function(req, callback) {
  var token = req.headers["x-access-token"];
  if (!token) return callback(true);
  jwt.verify(token, APP_SECRET_KEY, function(err, decoded) {
    if (err) return callback(true);
    if ( decoded && decoded.manager === true ) return callback(false, decoded);
    return callback(true);
  });
};

exports.verifyUserToken = function(req, callback) {
  var token = req.headers["x-access-token"];
  if (!token) return callback(true);
  jwt.verify(token, APP_SECRET_KEY, function(err, decoded) {
    if (err) return callback(true);
    if ( decoded && decoded.user === true ) return callback(false, decoded);
    return callback(true);
  });
};

// function
function sendToIndividual(scope, payload, retries) {
  if (retries == MAX_RETRIES_MESSAGING) {
    console.log("scope: " + scope + " permanently failed");
    return;
  }
  admin.messaging().sendToTopic(scope.trim(), payload)
    .then(function(response) {
      console.log(response);
    })
    .catch(function(error) {
      console.log(error);
      setTimeout(() => {
        sendToIndividual(scope, payload, retries + 1);
      }, 1000);
    });
}
