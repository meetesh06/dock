/*
  * API COLLECTION FOR AUTHORIZATION - REQUIRED BY EVERY API INIT
*/
const APP_SECRET_KEY = "KmnIIN60jZSN4wWXN52F-dope";
const express = require("express");
const emailValidator = require("email-validator");
const actions = require("../../actions/actions");
const db = require("../../db");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const constants = require("../../constants");
const cryptr = require("cryptr");
const passwordHash = require("password-hash");
const saveFiles = actions.saveFiles;
const CLIENT_ID = "7449865696-f0gevigpsirhflrihhvvhh1h18st6ujg.apps.googleusercontent.com";
const {OAuth2Client} = require("google-auth-library");
const client = new OAuth2Client(CLIENT_ID);
const cryptrObject = new cryptr(APP_SECRET_KEY);
const verifyManagerToken = actions.verifyManagerToken;
const verifyTempToken = actions.verifyTempToken;
const verifyUserToken = actions.verifyUserToken;
const TABLE_USERS = constants.TABLE_USERS;
const TABLE_USERS_ADMIN = constants.TABLE_USERS_ADMIN;
const dbo = db.getDb();
const router = express.Router();

router.use(bodyParser.json()); // support json encoded bodies
router.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

/*
  * API end point to verify a manager
  * TOKEN CHECK REQUIRED
  * Require ()
  * Return (NEW JWT TOKEN)
*/
router.post("/auth/manager/verify", (req, res) => {
  verifyManagerToken(req, (err, decoded) => {
    if(err) {
      return res.json({
        error: true,
        mssg: "Token Verification failed."
      });
    } 
    else {
      const token_payload = {
        email: decoded.email,
        name: decoded.name,
        college: decoded.college,
        scope: decoded.scope,
        limits: decoded.limits,
        channel : decoded.channel,
        manager: decoded.manager
      };
      jwt.sign(token_payload, APP_SECRET_KEY, { expiresIn: "100d" }, function(err, token) {
        if(err) {
          return res.json({
            error: true,
            mssg: "error signing token"
          });
        }
        return res.json({
          error: false,
          token,
        });
      });
    }
  });
});

/*
  * API end point for signin a user
  * NO TOKEN CHECK
  * Require (verified_email, token_generated_from_google)
  * Return (*CREATE A NEW USER, NEW TOKEN)
*/
router.post("/auth/signin", (req, res) => {
  if (!req.body) return res.json({
    error: true,
    mssg: "missing fields"
  });
  const email = req.body.email;
  const token = req.body.token;
  if ( email === undefined  || token === undefined) {
    return res.json({
      error: true,
      mssg: "missing fields"
    });
  }

  if (!emailValidator.validate(email)) {
    return res.json({
      error: true,
      mssg: "invalid email"
    });
  }

  if(verify(token)){
  dbo.collection(TABLE_USERS).findOne(
    {
      email
    }, (err, result) => {
      if(err) {
        return res.json({
          error: true,
          mssg: "error processing request"
        });
      }
      if(result) {
        const token = jwt.sign({
          email: req.body.email,
          college: result.college,
          name: result.username,
          gender : result.gender,
          mobile : result.mobile,
          id : (req.body.email + "-" + result.username).replace(/\./g, "$"),
          user: true
        },
        APP_SECRET_KEY, {
          expiresIn: "100d"
        });
        return res.json({
          error: false,
          newUser: false,
          token,
          data: result
        });
      } else {
        const token = jwt.sign({
          email: req.body.email,
          newUser: true,
          temp: true
        },
        APP_SECRET_KEY, {
          expiresIn: "3h"
        });
        return res.json({
          error: false,
          newUser: true,
          token
        });
      }
    });
  } else {
    return res.json({
      error : true,
      mssg : 'Invalid identity found, blocked!'
    })
  }
});

router.post("/auth/verify", (req, res) => {
  verifyTempToken(req, (err, decoded) => {
    if(err) {
      return res.json({
        error: true,
        mssg: "Token Verification failed."
      });
    } else {
      const decryptedPin = cryptrObject.decrypt(decoded.pin);
      if (decryptedPin+"".trim() === req.body.pin+"".trim() && decoded.email === req.body.email) {
        const email = decoded.email;
        dbo.collection(TABLE_USERS).findOne(
          {
            email
          }, (err, result) => {
            if(err) {
              return res.json({
                error: true,
                mssg: "error processing request"
              });
            }
            // result === null, If the user does not exist
            // result !== This is the user data
            if(result) {
              const token = jwt.sign({
                email: req.body.email,
                college: decoded.college,
                name: result.name,
                gender : result.gender,
                scope: result.scope,
                user: true
              },
              APP_SECRET_KEY, {
                expiresIn: "100d"
              });
              
              return res.json({
                error: false,
                newUser: false,
                token,
                data: result
              });
            } else {
              const token = jwt.sign({
                email: req.body.email,
                newUser: true,
                temp: true
              },
              APP_SECRET_KEY, {
                expiresIn: "2h"
              });
              return res.json({
                error: false,
                newUser: true,
                token
              });
            }
          });
      } else {
        return res.json({
          error: true,
          mssg: "authentication failed"
        });
      }
    }
  });
});

router.post("/auth/new-user", (req, res) => {
  console.log(req.body);
  verifyTempToken(req, (err, decoded) => {
    if(err) {
      return res.json({
        error: true,
        mssg: "Token Verification failed."
      });
    } else {
      if(decoded.newUser === true) {
        let name = req.body.name;
        let email = decoded.email;
        let college = req.body.college;
        let mobile = req.body.mobile;
        let gender = req.body.gender;
        let id  = (email + "-" + name).replace(/\./g, "$");

        if(name === undefined || email === undefined || college === undefined || gender === undefined || mobile === undefined) {
          return res.json({
            error: true,
            mssg: "Invalid request"
          });
        }

        if(!(gender === "M" || gender === "F")) {
          return res.json({
            error: true,
            mssg: "invalid email"
          });
        }
        if (!emailValidator.validate(email)) {
          return res.json({
            error: true,
            mssg: "invalid email"
          });
        }
        const params = {
          name,
          email,
          college,
          mobile,
          gender,
          id,
        };

        saveFiles(( req.files === undefined || req.files === null ) ? [] : req.files, (media, err) => {
          console.log(err);
          params["media"] = media;
          dbo.collection(TABLE_USERS).replaceOne({
            email
          }, params, {
            upsert: true
          }, function(err) {
            if (err) {
              return res.json({
                error: true,
                mssg: err
              });
            } else {
              const JWTToken = jwt.sign({
                email,
                name,
                college,
                id,
                gender,
                user: true
              },
              APP_SECRET_KEY, {
                expiresIn: "100d"
              });
              return res.json({
                error: false,
                token: JWTToken,
                data : params,
                mssg: "success"
              });
            }
          });
        }, { email, name });
      } else {
        return res.json({
          error: true,
          mssg: "Token Verification failed."
        });
      }
    }
  });
});

router.post("/auth/user/update-interest", (req, res) =>{
  const interests = req.body.interests;
  if(interests === undefined){
    return res.json({
      error: true,
      mssg: "missing fields"
    });
  }
  verifyUserToken(req, (err, decoded) => {
    if(err) {
      console.log(err);
      return res.json({
        error: true,
        mssg: "Token Verification failed."
      });
    } else {
      const email = decoded.email;
      dbo.collection(TABLE_USERS).update({email}, {$set : {interests : []}}, (err, result) => {
        dbo.collection(TABLE_USERS).update({email}, {$push : {interests : {$each : interests}}}, (err, result) => {
          if(err){
            return res.json({
              error : true,
              mssg : err
            });
          }
          return res.json({
            error : false,
            mssg : "sucess"
          });
        });
      });
    }});
});

router.post("/auth/manager/signin", (req, res) => {
  if (!req.body) return res.json({
    error: true,
    mssg: "missing fields"
  });
  const email = req.body.email;
  const password = req.body.password;
  if ( email === undefined || password === undefined ) {
    return res.json({
      error: true,
      mssg: "missing fields"
    });
  }
  if (!emailValidator.validate(email)) {
    return res.json({
      error: true,
      mssg: "invalid email"
    });
  }
  // do the login part here
  dbo.collection(TABLE_USERS_ADMIN).findOne({
    email
  }, function(err, data) {
    if (err) {
      return res.json({
        error: true,
        mssg: "invalid username/password combination"
      });
    }
    if (data) {
      if (passwordHash.verify(password, data.password)) {
        const token_payload = {
          email: data.email,
          name: data.name,
          college: data.college,
          scope: data.scope,
          channel: data.channel,
          limits: data.limits,
          manager: true
        };
        jwt.sign(token_payload, APP_SECRET_KEY, { expiresIn: "100d" }, function(err, token) {
          if(err) {
            return res.json({
              error: true,
              mssg: "error signing token"
            });
          }
          return res.json({
            error: false,
            token
          });
        });
      } else {
        return res.json({
          error: true,
          mssg: "invalid username/password combination"
        });
      }
    } else {
      return res.json({
        error: true,
        mssg: "invalid username/password combination"
      });
    }
  });
});

async function verify(token) {
  const ticket = await client.verifyIdToken({
      idToken: token,
      audience: CLIENT_ID,
  });
  const payload = ticket.getPayload();
  const aud = payload['aud'];
  console.log(token, aud);
  if(aud === CLIENT_ID)
    return true
  else
    return false
}

module.exports = router;