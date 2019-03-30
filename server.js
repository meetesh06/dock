/* MAIN */
const express = require("express");
const fileUpload = require("express-fileupload");
const fs = require("fs");
const readDir = require("fs-readdir-recursive");
const path = require("path");
const mime = require("mime");
const stream = require("stream");
const PORT = 65534;
const HOST = "127.0.0.1";
// const db = require("./db");

const db_diag_conn = require("./db_diag");
const db_activities_conn = require("./db_activities");
const db_users_conn = require("./db_users");
const db_static_conn = require("./db_static");
const db_events_conn = require("./db_events");
const db_notifications_conn = require("./db_notifications");

const app = express();
const files = {};

function toArrayBuffer(buf) {
  var ab = new ArrayBuffer(buf.length);
  var view = new Uint8Array(ab);
  for (var i = 0; i < buf.length; ++i) {
    view[i] = buf[i];
  }
  return ab;
}

// readDir(path.join(__dirname, "actions/media")).forEach(function (name) {
//   const pathname = "/" + name;
//   const obj = {};
//   const filename = obj.path = path.join(path.join(__dirname, "actions/media"), name);
  
//   const type = mime.getType(filename);
//   const buffer = fs.readFileSync(filename);
//   if(type.includes("video")) {
//     files[pathname] = buffer;
//   }
// });

// app.use((req, res, next) => {
//   const range = req.headers.range;
//   console.log("video request",range);
//   if (range && files[req.path]) {
//     const bufferStream = new stream.PassThrough();
//     bufferStream.end(files[req.path]);
//     bufferStream.pipe(res)
//       .on("complete", function(job) {
//         job
//           .on("error", console.log)
//           .on("complete", function(metadata) {
//             console.log("job completed", metadata);
//           });
//       });
//     // var stat = fs.statSync(path);
//     // var total = stat.size;
//     // var parts = range.replace(/bytes=/, "").split("-");
//     // var partialstart = parts[0];
//     // var partialend = parts[1];

//     // var start = parseInt(partialstart, 10);
//     // var end = partialend ? parseInt(partialend, 10) : total-1;

//     // var chunksize = (end-start)+1;
//     // console.log('RANGE: ' + start + ' - ' + end + ' = ' + chunksize);

//     // var file = fs.createReadStream(path, {start: start, end: end});
//     // res.writeHead(206, { 'Content-Range': 'bytes ' + start + '-' + end + '/' + total, 'Accept-Ranges': 'bytes', 'Content-Length': chunksize, 'Content-Type': 'video/mp4' });
//     // file.pipe(res);
//   } else if(range) {
//     const pathname = "/" + req.path.slice(1);
//     const obj = {};
//     const filename = obj.path = path.join(path.join(__dirname, "actions/media"), req.path.slice(1));
//     const type = mime.getType(filename);
//     const buffer = fs.readFileSync(filename);
//     if(type.includes("video")) {
//       files[pathname] = buffer;
//     }
//     next();
//   } else {
//     next();
//   }
// });

app.use(express.static("email_resources"));
app.use(express.static("actions/media"));
app.use(express.static("public"));
app.use(fileUpload());

/* 
  db_diag
  logs
  tracks
*/
const db_diagnostics = new Promise(db_diag_conn.connectToServer);

/* 
  db_activities
  activities
*/
const db_activities = new Promise(db_activities_conn.connectToServer);

/* 
  db_users
	users
	users_admin
	super_admin
	tokens
*/
const db_users = new Promise(db_users_conn.connectToServer);

/* 
  db_static
  categories
  channels
  colleges
*/
const db_static = new Promise(db_static_conn.connectToServer);

/* 
  db_events
  events
  trending_events
*/
const db_events = new Promise(db_events_conn.connectToServer);

/* 
  db_notifications
  notifications
*/
const db_notifications = new Promise(db_notifications_conn.connectToServer);

Promise.all([db_diagnostics, db_activities, db_users, db_static, db_events, db_notifications])
  .then((values) => {
    console.log(values);
    const notifications_manager = require("./api/notifications/notifications_manager");
    const notifications_user = require("./api/notifications/notifications_user");
    const events_crud = require("./api/events/events_crud");
    const events_user = require("./api/events/events_user");
    const events_manager = require("./api/events/events_manager");
    const channels = require("./api/channels/channels_crud");
    const channels_user = require("./api/channels/channels_user");
    const users_crud = require("./api/users/users_crud");
    const channels_manager = require("./api/channels/channels_manager");
    const auth = require("./api/auth/auth");
    const manager = require("./api/manager/manager");
    const others = require("./api/other/others");
    const admin = require("./api/admin/admin");
    const routerUser = express.Router();

    //api specific routes
    routerUser.get("*", function(req, res) {
      res.sendFile(path.resolve(__dirname,"public/index.html"));
    });
  
    app.use("/", events_crud);
    app.use("/", events_user);
    app.use("/", events_manager);
    app.use("/", channels);
    app.use("/", channels_user);
    app.use("/", users_crud);
    app.use("/", channels_manager);
    app.use("/", auth);
    app.use("/", manager);
    app.use("/", others);
    app.use("/", admin);
    app.use("/", notifications_manager);
    app.use("/", notifications_user);
    app.use("/", routerUser);
  
    app.listen(PORT, HOST, () => {
      console.log("Campus Story API Server is live on http://"+HOST+":"+PORT);
    });
  })
  .catch((err) => {
    console.log(err);
  });

/*  
  * USERNAME : ssh -p 7822 mycampu1@mycampusdock.com
  * USERNAME_ALT : ssh -p 7822 mycampus@mycampusdock.chat ==> 0Hh.b0T!a8F3yX
  * PASSWORD : YOU ALREADY KNOW IF YOU HAVE ACCESS TO THESE FILES!
  * ogil7190 : sha1$ec32d226$1$f970204d1702048853bd67864e43e1b581bc6327
*/