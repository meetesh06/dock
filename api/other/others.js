/* API COLLECTIONS FOR OTHER BASIC ROUTES */
var express = require("express");
var router = express.Router();
const actions = require("../../actions/actions");
const sendToScope = actions.sendToScope;
var fs = require("fs");

/*
  * VISIBLE API end point to get terms of service, Dock
*/
router.get("/terms", (req, res) => {
  fs.readFile(__dirname + "/terms.html", (err, html) =>{
    res.writeHeader(200, {"Content-Type": "text/html"});
    const payload = {
      data: {
        type: "demo",
        content: JSON.stringify({ ogil : "dope"})
      }
    };
    sendToScope(["ogil"], payload);
    res.write(html);  
    res.end(); 
  });
});

/*
  * VISIBLE API end point to get Home Page, Dock
*/
router.get("/", (req, res) => {
  fs.readFile(__dirname + "/home.html", (err, html) =>{
    res.writeHeader(200, {"Content-Type": "text/html"});  
    res.write(html);  
    res.end(); 
  });
});

module.exports = router;