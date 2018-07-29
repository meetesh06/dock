const express = require("express");
// Host and port information
const PORT = 65534;
const HOST = "127.0.0.1";
// Importing the required route apis
var db = require("./db");
// express starts here
const app = express();
// defining middleware and other things
app.use(express.static("email_resources"));
db.connectToServer( function( err ) {
  if (err) {
    console.log("Unable to connect to Mongo.");
    process.exit(1);
  } else {
    const events_crud = require("./api/events/events_crud");
    const channels = require("./api/channels/channels");
    const auth = require("./api/auth/auth");
    const manager = require("./api/manager/manager");
    const others = require("./api/other/others");

    app.use("/", events_crud);
    app.use("/", channels);
    app.use("/", auth);
    app.use("/", manager);
    app.use("/", others);
    app.listen(PORT, HOST, () => {
      console.log("server is live on http://"+HOST+":"+PORT);
    });
  }
});

