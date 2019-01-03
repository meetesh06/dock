/*  API COLLECTIONS FOR MANAGER ROUTES */
const express = require("express");
const actions = require("../../actions/actions");
const constants = require("../../constants");
const bodyParser = require("body-parser");
const db = require("../../db");
const dbo = db.getDb();
const router = express.Router();
const { ObjectId } = require('mongodb'); // or ObjectID 
const verifySuperToken = actions.verifySuperToken;
const TABLE_CHANNELS = constants.TABLE_CHANNELS;
const TABLE_CATEGORIES = constants.TABLE_CATEGORIES;

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
            media: ["channels/"+media],
            parent: decoded.email,
            college: decoded.college
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

router.post("/admin/update-channel", (req, res) => {
  if (!req.body) return res.json({
    error: true,
    mssg: "missing fields"
  });
  console.log(req.body);
  console.log(req.files);
  verifySuperToken(req, (err, decoded) => {
    if(err) {
      return res.json({
        error: true,
        mssg: "Token Verification failed."
      });
    } else {
      const _id = req.body._id;
      const name = req.body.name;
      const description = req.body.description;
      const creatorPassword = req.body.creatorPassword;

      if( _id === undefined || name === undefined || description === undefined || creatorPassword === undefined) return res.json({
        error: true,
        mssg: "missing fields"
      });
      
      if(req.files === undefined || req.files === null || req.files.length === 0) {
        dbo.collection(TABLE_CHANNELS).updateOne({ _id: ObjectId(_id) }, { $set:{ name, description, creator_password: creatorPassword } }, (err, data) => {
          if (err) {
            return res.json({
              error: true,
              mssg: "Unknown error occured"
            });
          }
          return res.json({
            error: false,
            mssg: "Updated Successfully"
          });
        });
      } else {
        saveFiles(req.files, function(media, err) {
          if (err) {
            return res.json({
              error: true,
              mssg: err
            });
          } else {
            dbo.collection(TABLE_CHANNELS).updateOne({ _id }, { $set:{ name, description, creator_password: creatorPassword, media: ["channels/"+media] } }, (err, res) => {
              if (err) {
                return res.json({
                  error: true,
                  mssg: "Unknown error occured"
                });
              }
              return res.json({
                error: false,
                mssg: "Updated Successfully"
              });
            });
          }
        }, undefined, "channel");
      }
    }
  });
});

/*
  * API end point to create a new channel (2 types)
  *     1) super admin - scope == xxx
  *     2) normal admin - scope == 100
  * Requires (TOKEN, hash)
  * Returns (NEW BUNDLE)
*/
router.post("/admin/get-categories", (req, res) => {
  if (!req.body) return res.json({
    error: true,
    mssg: "missing fields"
  });
  verifySuperToken(req, (err, decoded) => {
    if(err) {
      return res.json({
        error: true,
        mssg: "Token Verification failed."
      });
    } else {
      
      
      dbo.collection(TABLE_CATEGORIES).find({
      }).toArray(function(err, data) {
        if (err) {
          return res.json({
            error: true,
            mssg: "Unknown error occured"
          });
        }
        return res.json({
          error: false,
          mssg: "lisiting returned",
          data: data
        });
      });
        
      
    }
  });
});

router.post("/admin/get-channel-list", (req, res) => {
  if (!req.body) return res.json({
    error: true,
    mssg: "missing fields"
  });
  verifySuperToken(req, (err, decoded) => {
    if(err) {
      return res.json({
        error: true,
        mssg: "Token Verification failed."
      });
    } else {
      
      let params = { college: decoded.college };
      if(decoded.scope === "xxx") {
        params = {};
      }
      dbo.collection(TABLE_CHANNELS).find(
        params
      ).toArray(function(err, data) {
        if (err) {
          return res.json({
            error: true,
            mssg: "Unknown error occured"
          });
        }
        return res.json({
          error: false,
          mssg: "lisiting returned",
          data: data
        });
      });
        
      
    }
  });
});

module.exports = router;