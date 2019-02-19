/*
  * API COLLECTION FOR AUTHORIZATION - REQUIRED BY EVERY API
*/
const APP_SECRET_KEY = "KmnIIN60jZSN4wWXN52F-dope";
const express = require("express");
const emailValidator = require("email-validator");
const actions = require("../../actions/actions");
const db = require("../../db");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const constants = require("../../constants");
const passwordHash = require("password-hash");
const verifyManagerToken = actions.verifyManagerToken;
const verifySuperToken = actions.verifySuperToken;
const verifyCommonToken = actions.verifyCommonToken;
const TABLE_CHANNELS = constants.TABLE_CHANNELS;
const TABLE_USERS_ADMIN = constants.TABLE_USERS_ADMIN;
const TABLE_USERS = constants.TABLE_USERS;
const TABLE_TOKENS = constants.TABLE_TOKENS;
const TABLE_LOGS = constants.TABLE_LOGS;
const TABLE_TRACKS = constants.TABLE_TRACKS;
const TABLE_SUPER_ADMIN = constants.TABLE_SUPER_ADMIN;
const dbo = db.getDb();
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
      dbo.collection(TABLE_CHANNELS).findOne({ _id : data.channel_id}, (err, result)=>{
        if(result){
          console.log(result);
          if (passwordHash.verify(password, data.password)) {
            const token_payload = {
              email: data.email,
              name: data.name,
              college: data.college,
              scope: data.scope,
              channel: result,
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
          else {
            return res.json({
              error: true,
              mssg: "invalid username/password combination"
            });
          }
        }
        else {
          return res.json({
            error: true,
            mssg: "Channel Does not exist"
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
  dbo.collection(TABLE_SUPER_ADMIN).findOne({
    email
  }, function(err, data) {
    if (err) {
      return res.json({
        error: true,
        mssg: "invalid username/password combination"
      });
    }
    if (data != null) {
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
  dbo.collection(TABLE_USERS).findOne({_id}, (err, result)=>{
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
            dbo.collection(TABLE_USERS).replaceOne({_id}, params, {upsert: true}, function(err) {
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

      const token_payload = {
        id : _id,
        college,
        interests,
        others,
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
            others,
            token
          };
          dbo.collection(TABLE_USERS).replaceOne({_id}, params, {upsert: true}, function(err) {
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


router.post("/auth/update-user", (req, res) => {
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

  verifyCommonToken(req, (err, decoded) => {
    if(err) {
      return res.json({
        error: true,
        mssg: "Token Verification failed."
      });
    }
    else {
      dbo.collection(TABLE_USERS).update({_id: decoded.id}, {$set: {interests, user_data}}, {upsert: true}, ()=>{
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
      dbo.collection(TABLE_LOGS).insertOne({timestamp, session_id, logs});
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
      dbo.collection(TABLE_TRACKS).insertOne({timestamp, session_id, logs});
      return res.json({
        error : false
      });
    }
  });
});



/* SAVE ANY ISSUED TOKEN TO DB */
function saveToken(token, callback){
  dbo.collection(TABLE_TOKENS).insertOne({token}, (err)=>{
    if(!err) return callback(false, null);
    else return callback(true, err);
  });
}

module.exports = router;

// /*
//   * API end point for signin a user
//   * NO TOKEN CHECK
//   * Require (verified_email, token_generated_from_google)
//   * Return (CREATE A NEW USER, NEW TOKEN)
// */
// router.post("/auth/signin", (req, res) => {
//   if (!req.body) return res.json({
//     error: true,
//     mssg: "missing fields"
//   });
//   const email = req.body.email;
//   const token = req.body.token;
//   if ( email === undefined  || token === undefined) {
//     return res.json({
//       error: true,
//       mssg: "missing fields"
//     });
//   }

//   if (!emailValidator.validate(email)) {
//     return res.json({
//       error: true,
//       mssg: "invalid email"
//     });
//   }
//   const verified = await verify(token);
//   dbo.collection(TABLE_USERS).findOne(
//     {
//       email
//     }, (err, result) => {
//       if(err) {
//         return res.json({
//           error: true,
//           mssg: "error processing request"
//         });
//       }
//       if(result) {
//         const token = jwt.sign({
//           email: req.body.email,
//           college: result.college,
//           name: result.name,
//           gender : result.gender,
//           mobile : result.mobile,
//           verified,
//           id : (req.body.email + "-" + result.name).replace(/\./g, "$"),
//           user: true
//         },
//         APP_SECRET_KEY, {
//           expiresIn: "100d"
//         });
//         return res.json({
//           error: false,
//           newUser: false,
//           token,
//           verified,
//           data: result
//         });
//       } else {
//         const token = jwt.sign({
//           email: req.body.email,
//           newUser: true,
//           temp: true
//         },
//         APP_SECRET_KEY, {
//           expiresIn: "3h"
//         });
//         return res.json({
//           error: false,
//           newUser: true,
//           token
//         });
//       }
//     });
// });


// /*
//   * API end point to generate new user
//   * TEMP TOKEN CHECK REQUIRED
//   * Requires (name, email, verified_college, mobile, gender, pic uri)
//   * returns ( NEW TOKEN, Data)
// */
// router.post("/auth/new-user", (req, res) => {
//   verifyTempToken(req, (err, decoded) => {
//     if(err) {
//       return res.json({
//         error: true,
//         mssg: "Token Verification failed."
//       });
//     } else {
//       if(decoded.newUser === true) {
//         let name = req.body.name;
//         let email = decoded.email;
//         let college = req.body.college;
//         let mobile = req.body.mobile;
//         let gender = req.body.gender;
//         let device = req.body.device;
//         let fb_token = req.body.fb_token;
//         let id  = (email + "-" + name).replace(/\./g, "$");

//         if(name === undefined || email === undefined || college === undefined || gender === undefined || mobile === undefined) {
//           return res.json({
//             error: true,
//             mssg: "Invalid request"
//           });
//         }

//         if(!(gender === "M" || gender === "F")) {
//           return res.json({
//             error: true,
//             mssg: "invalid email"
//           });
//         }
//         if (!emailValidator.validate(email)) {
//           return res.json({
//             error: true,
//             mssg: "invalid email"
//           });
//         }

//         const params = {
//           name,
//           email,
//           college,
//           mobile,
//           gender,
//           fb_token,
//           device,
//           _id : id,
//         };

//         saveFiles(( req.files === undefined || req.files === null ) ? [] : req.files, (media, err) => {
//           params["media"] = media;
//           dbo.collection(TABLE_USERS).replaceOne({
//             email
//           }, params, {
//             upsert: true
//           }, function(err) {
//             if (err) {
//               return res.json({
//                 error: true,
//                 mssg: err
//               });
//             } else {
//               const JWTToken = jwt.sign({
//                 email,
//                 name,
//                 college,
//                 id,
//                 gender,
//                 user: true
//               },
//               APP_SECRET_KEY, {
//                 expiresIn: "100d"
//               });
//               return res.json({
//                 error: false,
//                 token: JWTToken,
//                 data : params,
//               });
//             }
//           });
//         }, { email, name });
//       } else {
//         return res.json({
//           error: true,
//           mssg: "Token Verification failed."
//         });
//       }
//     }
//   });
// });

// /*
//   * API end point to update interests of a user
//   * TOKEN CHECK REQUIRED
//   * Requires (token, interests_array)
//   * returns (ACKNOWLEDGEMENT)
// */
// router.post("/auth/user/update-interest", (req, res) =>{
//   const interests = req.body.interests;
//   if(interests === undefined){
//     return res.json({
//       error: true,
//       mssg: "missing fields"
//     });
//   }
//   verifyUserToken(req, (err, decoded) => {
//     if(err) {
//       console.log(err);
//       return res.json({
//         error: true,
//         mssg: "Token Verification failed."
//       });
//     } else {
//       const email = decoded.email;
//       dbo.collection(TABLE_USERS).update({email}, {$set : {interests : []}}, (err, result) => {
//         dbo.collection(TABLE_USERS).update({email}, {$push : {interests : {$each : interests}}}, (err, result) => {
//           if(err){
//             return res.json({
//               error : true,
//               mssg : err
//             });
//           }
//           return res.json({
//             error : false,
//             mssg : "sucess"
//           });
//         });
//       });
//     }});
// });