/*  API COLLECTIONS FOR MANAGER ROUTES */
const express = require("express");
const actions = require("../../actions/actions");
const constants = require("../../constants");
const bodyParser = require("body-parser");
const db = require("../../db");
const dbo = db.getDb();
const router = express.Router();
const verifySuperToken = actions.verifySuperToken;
const TABLE_CHANNELS = constants.TABLE_CHANNELS;

const saveFiles = actions.saveFiles;

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

/*
  * API end point to create a new channel (2 types)
  *     1) super admin - scope == xxx
  *     2) normal admin - scope == 100
  * Requires (TOKEN, hash)
  * Returns (NEW BUNDLE)
*/
router.post("/admin/create-channel", (req, res) => {
  if (!req.body) return res.json({
    error: true,
    mssg: "missing fields"
  });
  // console.log(req.body);
  // console.log(req.files);
  verifySuperToken(req, (err, decoded) => {
    if(err) {
      return res.json({
        error: true,
        mssg: "Token Verification failed."
      });
    } else {
      
      const name = req.body.name;
      const description = req.body.description;
      const private = req.body.private;
      const official = req.body.official;
      const category = req.body.category;
      const creatorName = req.body.creatorName;
      const creatorEmail = req.body.creatorEmail;
      const creatorPassword = req.body.creatorPassword;
      if(name === undefined || description === undefined || private === undefined || official === undefined || category === undefined || creatorName === undefined || creatorEmail === undefined || creatorPassword === undefined) return res.json({
        error: true,
        mssg: "missing fields"
      });
      if(req.files === undefined || req.files.length === 0) {
        return res.json({
          error: true,
          mssg: "invalid request, no files"
        });
      }
      saveFiles(req.files, function(media, err) {
        if (err) {
          return res.json({
            error: true,
            mssg: err
          });
        } else {
          dbo.collection(TABLE_CHANNELS).insertOne({
            name,
            description,
            private: private === "true" ? true : false,
            priority: official === "true" ? 5 : 3,
            category,
            creator: creatorName,
            created_on: new Date(),
            creator_email: creatorEmail,
            creator_password: creatorPassword,
            media: "channels/"+media,
            parent: decoded.email
          }, function(err, data) {
            if (err) {
              return res.json({
                error: true,
                mssg: "Unknown error occured"
              });
            }
            return res.json({
              error: false,
              mssg: "Created Successfully"
            });
          });
        }
      }, undefined, "channel");
      
    }
  });
});

module.exports = router;