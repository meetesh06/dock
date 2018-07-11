const express = require("express");
const app = express();
const bodyParser = require("body-parser");
// Host and port information
const PORT = 8080;
const HOST = "127.0.0.1";
// Importing the required route apis
const events = require("./api/events/events.js");
const channels = require("./api/channels/channels");
const auth = require("./api/auth/auth");

// defining middleware and other things
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

app.use("/", events);
app.use("/", channels);
app.use("/", auth);

app.listen(PORT, HOST, () => {
  console.log("server is live on http://"+HOST+":"+PORT);
});