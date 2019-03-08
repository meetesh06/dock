/* API COLLECTIONS FOR OTHER BASIC ROUTES */
var express = require("express");
const actions = require("../../actions/actions");
const gotEmail = actions.gotEmail;
var router = express.Router();

router.post("/public/contact", (req, res) => {
  if (!req.body) return res.json({
    error: true,
    mssg: "missing fields"
  });
  
  const name = req.body.name;
  const email = req.body.email;
  const subject = req.body.subject;
  const description = req.body.description;
  
  if (
    name === undefined ||
    email === undefined ||
    subject === undefined ||
    description === undefined
  ) {
    return res.json({
      error: true,
      mssg: "missing fields"
    });
  }

  gotEmail(email, name, subject, description, (err) => {
    if(err) return res.json({
      error: true,
      mssg: "missing fields"
    });
    res.json({
      error: false,
      mssg: "successfully sent email"
    });
  });
  
});
  

module.exports = router;