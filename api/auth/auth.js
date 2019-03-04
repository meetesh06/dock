/*
  * API COLLECTION FOR AUTHORIZATION - REQUIRED BY EVERY API
*/
const APP_SECRET_KEY = "KmnIIN60jZSN4wWXN52F-dope";
const express = require("express");
const emailValidator = require("email-validator");
const actions = require("../../actions/actions");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const constants = require("../../constants");
const passwordHash = require("password-hash");
const verifyManagerToken = actions.verifyManagerToken;
const verifySuperToken = actions.verifySuperToken;
const verifyCommonToken = actions.verifyCommonToken;
const TABLE_CHANNELS = constants.TABLE_CHANNELS; // static
const TABLE_USERS_ADMIN = constants.TABLE_USERS_ADMIN; // users
const TABLE_USERS = constants.TABLE_USERS; // users
const TABLE_TOKENS = constants.TABLE_TOKENS; // users
const TABLE_LOGS = constants.TABLE_LOGS; // diagnostics
const TABLE_TRACKS = constants.TABLE_TRACKS; // diagnostics
const TABLE_SUPER_ADMIN = constants.TABLE_SUPER_ADMIN; // users
const db_static = require("../../db_static");
const dbo_static = db_static.getDb();
const db_users = require("../../db_users");
const dbo_users = db_users.getDb();
const db_diag = require("../../db_diag");
const dbo_diag = db_diag.getDb();

const router = express.Router();

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

/*
  * API end point to verify a manager
  * TOKEN CHECK REQUIRED
  * Require (Token)
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
        saveToken(token, (err, err_mssg)=>{
          if(!err) return res.json({
            error: false,
            token
          });
          else return res.json({
            error: true,
            mssg : err_mssg
          });
        });
      });
    }
  });
});

router.post("/auth/super/verify", (req, res) => {
  verifySuperToken(req, (err, decoded) => {
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
        super: decoded.super
      };
      jwt.sign(token_payload, APP_SECRET_KEY, { expiresIn: "100d" }, function(err, token) {
        if(err) {
          return res.json({
            error: true,
            mssg: "error signing token"
          });
        }

        saveToken(token, (err, err_mssg)=>{
          if(!err) return res.json({
            error: false,
            token
          });
          else return res.json({
            error: true,
            mssg : err_mssg
          });
        });
      });
    }
  });
});

/*
  * API end point to signin manager side
  * NO TOKEN CHECK REQUIRED
  * Requires (email, password)
  * returns (NEW TOKEN)
*/
router.post("/auth/manager/signin", (req, res) => {
  if (!req.body) return res.json({
    error: true,
    mssg: "missing fields"
  });

  const user_id = req.body.user_id; /* user id */
  const password = req.body.password;

  if (user_id === undefined || password === undefined) {
    return res.json({
      error: true,
      mssg: "missing fields"
    });
  }

  dbo_users.collection(TABLE_USERS_ADMIN).findOne({user_id}, (err, data) => {
    if(err){
      return res.json({
        error: true,
        mssg: "invalid username/password combination"
      });
    }

    else if(data && passwordHash.verify(password, data.password)) {
      dbo_static.collection(TABLE_CHANNELS).findOne({ _id : data.channel_id}, (err, result)=>{
        if(err){
          return res.json({
            error: true,
            mssg: "something went wrong"
          });
        } else if(result){
          const token_payload = {
            id: data.user_id,
            college: data.college,
            channel: result._id,
            channel_name: result.name,
            channel_category: result.category,
            private : result.private,
            authority : data.authority,
            manager: true
          };
          jwt.sign(token_payload, APP_SECRET_KEY, { expiresIn: "100d" }, function(err, token) {
            if(err) {
              return res.json({
                error: true,
                mssg: "error signing token"
              });
            }
            saveToken(token, (err, err_mssg)=>{
              if(!err) return res.json({
                error: false,
                token
              });
              else return res.json({
                error: true,
                mssg : err_mssg
              });
            });
          });
        } else {
          return res.json({
            error: true,
            mssg: "invalid username/password combination"
          });
        }
      });
    }
    else {
      return res.json({
        error: true,
        mssg: "invalid username/password combination"
      });
    }
  });
});

router.post("/auth/super/signin", (req, res) => {
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
  dbo_users.collection(TABLE_SUPER_ADMIN).findOne({email}, function(err, data) {
    if(err) {
      return res.json({
        error: true,
        mssg: "invalid username/password combination"
      });
    }
    if(data != null) {
      if (passwordHash.verify(password, data.password)) {
        const token_payload = {
          email: data.email,
          name: data.name,
          college: data.college,
          scope: data.scope,
          super: true
        };
        jwt.sign(token_payload, APP_SECRET_KEY, { expiresIn: "100d" }, function(err, token) {
          if(err) {
            return res.json({
              error: true,
              mssg: "error signing token"
            });
          }
          saveToken(token, (err, err_mssg)=>{
            if(!err) return res.json({
              error: false,
              token
            });
            else return res.json({
              error: true,
              mssg : err_mssg
            });
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

router.post("/auth/get-general-token", (req, res) => {
  if (!req.body) return res.json({
    error: true,
    mssg: "invalid request"
  });

  const college = req.body.college;
  const interests = req.body.interests;
  const others = req.body.others;
  const _id = req.body.id;

  if( college === undefined || interests === undefined || others === undefined ) return res.json({
    error: true,
    mssg: "invalid request"
  });

  const other_details = JSON.parse(others);
  dbo_users.collection(TABLE_USERS).findOne({_id}, (err, result)=>{
    if(err){
      return res.json({
        error: true,
        mssg : err
      });
    } else {
      if(result){
        return res.json({
          error: false,
          data : result,
          exists : true
        });
      } else {
        const token_payload = {
          id : _id,
          college,
          interests,
          anonymous: true
        };
        jwt.sign(token_payload, APP_SECRET_KEY, { expiresIn: "100d" }, function(err, token) {
          if(err) {
            return res.json({
              error: true,
              mssg: err
            });
          } else {
            const params = {
              _id,
              college,
              interests,
              others : other_details,
              token
            };
            dbo_users.collection(TABLE_USERS).replaceOne({_id}, params, {upsert: true}, function(err) {
              if(err){
                return res.json({
                  error: true,
                  mssg: err
                });
              }
              return res.json({
                error: false,
                data : token
              });
            });
          }
        });
      }
    }
  });
});

router.post("/auth/reset-user", (req, res) => {
  if (!req.body) return res.json({
    error: true,
    mssg: "invalid request"
  });

  verifyCommonToken(req, (err, decoded) => {
    if(err) {
      return res.json({
        error: true,
        mssg: "Token Verification failed."
      });
    } 
    else {
      const college = req.body.college;
      const interests = req.body.interests;
      const others = req.body.others;
      const _id = req.body.id;

      if(decoded.id !== _id){ /* Not a same user misleading token sent*/
        return res.json({
          error: true,
          mssg: "Token Verification failed."
        });
      }

      if( college === undefined || interests === undefined || others === undefined ) 
        return res.json({
          error: true,
          mssg: "invalid request"
        });
      
      const other_details = JSON.parse(others);
      const token_payload = {
        id : _id,
        college,
        interests,
        anonymous: true
      };
      jwt.sign(token_payload, APP_SECRET_KEY, { expiresIn: "100d" }, function(err, token) {
        if(err) {
          return res.json({
            error: true,
            mssg: err
          });
        } else {
          const params = {
            _id,
            college,
            interests,
            others : other_details,
            token
          };
          dbo_users.collection(TABLE_USERS).replaceOne({_id}, params, {upsert: true}, function(err) {
            if(err){
              return res.json({
                error: true,
                mssg: err
              });
            }
            return res.json({
              error: false,
              data : token
            });
          });
        }
      });
    }
  });
});


router.post("/auth/update-user-data", (req, res) => {
  if (!req.body) return res.json({
    error: true,
    mssg: "invalid request"
  });

  const interests = req.body.interests;
  const user_data = req.body.user_data;

  if(interests === undefined || user_data === undefined){
    return res.json({
      error : true,
      mssg : "invalid request"
    });
  }

  const user_details = JSON.parse(user_data);
  verifyCommonToken(req, (err, decoded) => {
    if(err) {
      return res.json({
        error: true,
        mssg: "Token Verification failed."
      });
    }
    
    else {
      dbo_users.collection(TABLE_USERS).update({_id: decoded.id}, {$set: {interests, user_data : user_details}}, {upsert: true}, ()=>{
        return res.json({
          error : false
        });
      });      
    }
  });
});

router.post("/auth/put-logs", (req, res) => {
  if (!req.body) return res.json({
    error: true,
    mssg: "invalid request"
  });
  const timestamp = new Date();
  const session_id = req.body.session_id;
  const logs_array = req.body.logs;

  if(session_id === undefined || logs_array === undefined){
    return res.json({
      error : true,
      mssg : "invalid request"
    });
  }
  verifyCommonToken(req, (err) => {
    if(err) {
      return res.json({
        error: true,
        mssg: "Token Verification failed."
      });
    }
    else {
      let logs;
      try{
        logs = JSON.parse(logs_array);
      }
      catch(e){
        console.log(e);
      }
      dbo_diag.collection(TABLE_LOGS).insertOne({timestamp, session_id, logs});
      return res.json({
        error : false
      });
    }
  });
});

router.post("/auth/put-tracks", (req, res) => {
  if (!req.body) return res.json({
    error: true,
    mssg: "invalid request"
  });
  const timestamp = new Date();
  const session_id = req.body.session_id;
  const logs_array = req.body.logs;

  if(session_id === undefined || logs_array === undefined){
    return res.json({
      error : true,
      mssg : "invalid request"
    });
  }
  verifyCommonToken(req, (err) => {
    if(err) {
      return res.json({
        error: true,
        mssg: "Token Verification failed."
      });
    }
    else {
      let logs;
      try{
        logs = JSON.parse(logs_array);
      }
      catch(e){
        console.log(e);
      }
      dbo_diag.collection(TABLE_TRACKS).insertOne({timestamp, session_id, logs});
      return res.json({
        error : false
      });
    }
  });
});

/* SAVE ANY ISSUED TOKEN TO DB */
function saveToken(token, callback){
  dbo_diag.collection(TABLE_TOKENS).insertOne({token}, (err)=>{
    if(!err) return callback(false, null);
    else return callback(true, err);
  });
}

module.exports = router;