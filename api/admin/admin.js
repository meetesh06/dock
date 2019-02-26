/*  API COLLECTIONS FOR MANAGER ROUTES */
const express = require("express");
const actions = require("../../actions/actions");
const constants = require("../../constants");
const bodyParser = require("body-parser");

const router = express.Router();
const { ObjectId } = require("mongodb");
const verifySuperToken = actions.verifySuperToken;
const sendEmailHtml = actions.sendEmailHtml;
const TABLE_CHANNELS = constants.TABLE_CHANNELS;
const TABLE_CATEGORIES = constants.TABLE_CATEGORIES;
const TABLE_USERS_ADMIN = constants.TABLE_USERS_ADMIN;
const TABLE_TRENDING_EVENTS = constants.TABLE_TRENDING_EVENTS;
const TABLE_EVENTS = constants.TABLE_EVENTS;
const passwordHash = require("password-hash");
const saveFiles = actions.saveFiles;
const UID = actions.UID;
const helpers = require("../functions/functions");

const db_static = require("../../db_static");
const dbo_static = db_static.getDb();

const db_users = require("../../db_users");
const dbo_users = db_users.getDb();

// const db_diag = require("../../db_diag");
// const dbo_diag = db_diag.getDb();

// const db_activities = require("../../db_activities");
// const dbo_activities = db_activities.getDb();

const db_events = require("../../db_events");
const dbo_events = db_events.getDb();

// const db_notifications = require("../../db_notifications");
// const dbo_notifications = db_notifications.getDb();


const templates = require("../../templates");
const TEMPLATE_INVITE = templates.TEMPLATE_INVITE;

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
  verifySuperToken(req, (err, decoded) => {
    if(err) {
      return res.json({
        error: true,
        mssg: "Token Verification failed."
      });
    } else {
      const id = UID(12);
      const name = req.body.name;
      const description = req.body.description;
      const private = req.body.private;
      const official = req.body.official;
      const category = req.body.category;
      const creatorName = req.body.creatorName;
      const creatorEmail = req.body.creatorEmail;
      const creatorPassword = req.body.creatorPassword;
      if(helpers.isUndefined([name, description, private, official, category, creatorName, creatorEmail, creatorPassword]))return res.json({
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
          dbo_users.collection(TABLE_USERS_ADMIN).insertOne({
            email: creatorEmail,
            password: passwordHash.generate(creatorPassword),
            college: decoded.college,
            channel_id: id,
            authority: 0
          }, (err) => {
            if(err) return res.json({
              error: true,
              mssg: err.message
            });
            dbo_static.collection(TABLE_CHANNELS).insertOne({
              _id: id,
              name,
              description,
              private: private === "true" ? true : false,
              priority: official === "true" ? 5 : 3,
              category,
              creator: creatorName,
              created_on: new Date(),
              creator_email: creatorEmail,
              media: ["channels/"+media],
              parent: decoded.email,
              followers: [],
              channel_visits : 0,
              story_views : 0,
              last_updated : new Date(),
              college: decoded.college
            }, function(err) {
              if (err) {
                return res.json({
                  error: true,
                  mssg: err.message
                });
              }
              return res.json({
                error: false,
                mssg: "Created Successfully"
              });
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
  verifySuperToken(req, (err) => {
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
      if(creatorPassword !== "") {
        dbo_users.collection(TABLE_USERS_ADMIN).updateOne({ channel_id: _id }, { $set:{ password: passwordHash.generate(creatorPassword) } }, (err) => {
          if(err) return res.json({
            error: true,
            mssg: err
          });
          if(req.files === undefined || req.files === null || req.files.length === 0) {
            dbo_static.collection(TABLE_CHANNELS).updateOne({ _id: ObjectId(_id) }, { $set:{ name, description } }, (err) => {
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
                
                dbo_static.collection(TABLE_CHANNELS).update({ _id: ObjectId(_id) }, { $set:{ name, description, creator_password: creatorPassword, media: ["channels/"+media] } }, { upsert: false }, (err) => {
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
        });
      } else {
        if(req.files === undefined || req.files === null || req.files.length === 0) {
          dbo_static.collection(TABLE_CHANNELS).updateOne({ _id }, { $set:{ name, description } }, (err) => {
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
              dbo_static.collection(TABLE_CHANNELS).update({ _id }, { $set:{ name, description, creator_password: creatorPassword, media: ["channels/"+media] } }, { upsert: false }, (err) => {
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
  verifySuperToken(req, (err) => {
    if(err) {
      return res.json({
        error: true,
        mssg: "Token Verification failed."
      });
    } else {
      
      
      dbo_static.collection(TABLE_CATEGORIES).find({
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
      dbo_static.collection(TABLE_CHANNELS).find(
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

router.post("/admin/get-event-list", (req, res) => {
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
      
      dbo_events.collection(TABLE_EVENTS).find(
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

router.post("/admin/add-to-trending", (req, res) => {
  if (!req.body) return res.json({
    error: true,
    mssg: "missing fields"
  });
  const _id = req.body._id;
  let validity = req.body.validity;
  if(_id === undefined || validity === undefined) res.json({
    error: true,
    mssg: "Invalid Request"
  });
  try {
    validity = new Date(validity);
  } catch(e) {
    return res.json({
      error: true,
      mssg: "missing fields"
    });
  }
  verifySuperToken(req, (err, decoded) => {
    if(err) {
      return res.json({
        error: true,
        mssg: "Token Verification failed."
      });
    } else {
      let params = { _id };
      dbo_events.collection(TABLE_EVENTS).findOne(
        params, function(err, data) {
          if (err || data.college !== decoded.college) {
            return res.json({
              error: true,
              mssg: "Unknown error occured"
            });
          }
          const params = {
            _id: data._id,
            title: data.title,
            channel : data.channel, 
            date: data.date,
            media: data.media,
            validity,
            channel_name: data.channel_name,
            timestamp: data.timestamp,
            college: data.college
          };
          dbo_events.collection(TABLE_TRENDING_EVENTS).update(
            { _id }, { $set: params }, { upsert: true }, function(err, data) {
              if (err) {
                return res.json({
                  error: true,
                  mssg: err
                });
              }
              res.json({
                error: false,
                mssg: "Added successfully"
              });
            }
          );
        });
    }
  });
});

router.post("/admin/email-invite", (req, res) => {
  if (!req.body) return res.json({
    error: true,
    mssg: "missing fields"
  });
  const email = req.body.email;
  const name = req.body.name;
  const name1 = req.body.name1;
  if(
    email === undefined ||
    name === undefined ||
    name1 === undefined
  ) res.json({
    error: true,
    mssg: "Invalid Request"
  });

  verifySuperToken(req, (err, decoded) => {
    if(err) {
      return res.json({
        error: true,
        mssg: "Token Verification failed."
      });
    } else {
      const html = {
        content: TEMPLATE_INVITE(name, name1)
      };
      sendEmailHtml(
        email,
        "Welcome to Campus Story",
        html,
        (err) => {
          if(err) {
            return res.json({
              error: true,
              mssg: "Token Verification failed."
            });
          }
          return res.json({
            error: false,
            mssg: "Email Sent Successfully."
          });
        }
      );
    }
  });
});

router.post("/admin/get-trending", (req, res) => {
  verifySuperToken(req, (err, decoded) => {
    const today = new Date();
    today.setHours(0,0,0,0);
    const params = {
      date: { $gte: today },
      college: decoded.college
    };
    dbo_events.collection(TABLE_TRENDING_EVENTS)
      .find(params)
      .toArray(function(err, data) {
        if (err) {
          return res.json({
            error: true,
            mssg: err
          });
        }
        res.json({
          error: false,
          mssg: "Listing successful",
          data
        });
      });
  });
});

module.exports = router;