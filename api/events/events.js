var express = require("express");
var router = express.Router();
// DOCUMENTATION
// Here we take care of the creation of the CRUD of the events  

// Everything About using these routes
//
// All the token verification here are strictly done using permnent tokens.
//
// 1) /events/create -> 
//  expects: 
//    1) ..event_payload
//  replies:
//    1) error - boolean
//    2) mssg - string
//  other: 
//    sends a update to the scope
//    sends a email to the creator
//

// Event Creation

router.post("/events/create", (req, res) => {
  // verify token
  
  // verify body
  
  return res.json({
    error: false
  });
});

module.exports = router;