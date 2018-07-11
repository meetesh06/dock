const express = require("express");
// Host and port information
const PORT = 8080;
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
    const events = require("./api/events/events.js");
    const channels = require("./api/channels/channels");
    const auth = require("./api/auth/auth");

    app.use("/", events);
    app.use("/", channels);
    app.use("/", auth);
    app.listen(PORT, HOST, () => {
      console.log("server is live on http://"+HOST+":"+PORT);
    });
  }
});

