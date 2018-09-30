/* MAIN */
const express = require("express");
const fileUpload = require("express-fileupload");
const PORT = 65534;
const HOST = "127.0.0.1";
const db = require("./db");
const app = express();

app.use(express.static("email_resources"));
app.use(express.static("actions/media"));
app.use(fileUpload());

db.connectToServer( function( err ) {
  if (err) {
    console.log("Unable to connect to MongoDB.");
    process.exit(1);
  } else {

    const events_crud = require("./api/events/events_crud");
    const events_user = require("./api/events/events_user");
    const events_manager = require("./api/events/events_manager");
    const channels = require("./api/channels/channels_crud");
    const channels_user = require("./api/channels/channels_user");
    const channels_manager = require("./api/channels/channels_manager");
    const auth = require("./api/auth/auth");
    const manager = require("./api/manager/manager");
    const others = require("./api/other/others");

    app.use("/", events_crud);
    app.use("/", events_user);
    app.use("/", events_manager);
    app.use("/", channels);
    app.use("/", channels_user);
    app.use("/", channels_manager);
    app.use("/", auth);
    app.use("/", manager);
    app.use("/", others);

    app.listen(PORT, HOST, () => {
      console.log("Dock API Server is live on http://"+HOST+":"+PORT);
    });
  }
});

/*  
  * USERNAME : ssh -p 7822 mycampu1@mycampusdock.com
  * PASSWORD : YOU ALREADY KNOW IF YOU HAVE ACCESS TO THESE FILES!
  * ogil7190 : sha1$ec32d226$1$f970204d1702048853bd67864e43e1b581bc6327
*/