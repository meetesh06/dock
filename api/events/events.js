var express = require("express");
var router = express.Router();
// DOCUMENTATION
// Here we take care of the creation of the CRUD of the events  


// Event Creation

router.post("/events/create", (req, res) => {
  // verify token
  
  // verify body
  
  return res.json({
    error: false
  });
});

module.exports = router;