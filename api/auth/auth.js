// process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0; --> This hack I was using to skip the certificate test before, no longer needed
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

const cryptrObject = new cryptr(APP_SECRET_KEY);
const sendEmailHtml = actions.sendEmailHtml;
const verifyManagerToken = actions.verifyManagerToken;
const verifyTempToken = actions.verifyTempToken;
const TABLE_USERS = constants.TABLE_USERS;
const TABLE_USERS_ADMIN = constants.TABLE_USERS_ADMIN;
const dbo = db.getDb();
const router = express.Router();

// middlewares here
router.use(bodyParser.json()); // support json encoded bodies
router.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

// DOCUMENTATION
// Here we take care of the distribution of the tokens so it it very important to
// make sure checks are as good as possible, though things might slip just keep an
// eye out.
// These routes only operate on temporary tokens but they hand out permanent or session tokens to
// the users

// Things to consider: 
//  This API is responsible for the safety of all the other routes
//  Changes here will barely be changed, so no loose ends here
//  Always check the return type of functions that are not written by you
//  Remove Redundancy
//  All responses are by default status 200, no need to specify that every request

// Something to keep in mind
//  There are two types of tokens issued:
//    Temporary and Permanent - 
//    The methods verifyTempToken and verifyToken from actions.js are responsibe for these checks
//    To create a Temporary token, just encrypt a parameter named { temp: true } in the payload
//    The verifyTempToken - will only allow temporary tokens
//    The verifyToken - will only allow ordinary tokens

// Everything About using these routes
//
// The pin stored inside the token is now encrypted, hence the loophole of being
// able to get the pin just by decrypting the token is dealt with, also decided to store only non
// sensitive data in the token, no need of encrypted tokens in our case
//
// 1) /auth/android/signin -> 
//  expects: 
//    1) email - string
//  replies:
//    1) error - boolean
//    2) token - string 
//
// 2) /auth/android/verify -> 
//  expects: 
//    1) email - string
//    2) pin - string/number ( no need to trim, all that is taken care of )
//  replies:
//    (i) if existing user
//      1) error - boolean
//      2) newUser - boolean
//      3) token - string
//      3) data - object
//    (ii) if new user
//      1) error - boolean
//      2) newuser - boolean
//      3) token - string
//
// 3) /auth/android/new-user ->
// expects
//   1) roll_no - string
//   2) username - string
//   3) email - string
//   4) scope - string
//   5) college - string
//   6) gender - string( "M" or "F" )
// replies:
//   1) error - boolean
//   2) token - string
//   3) mssg - string
//
// 4) /auth/android/manager/signin ->
// expects
//   1) email - string
//   2) password - string
// replies:
//   1) error - boolean
//   2) token - string
//   3) mssg - string
//

router.post("/auth/android/manager/verify", (req, res) => {
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


router.post("/auth/android/signin", (req, res) => {
  if (!req.body) return res.json({
    error: true,
    mssg: "missing fields"
  });
  const email = req.body.email;
  if ( email === undefined ) {
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
  var pin = Math.floor(1000 + Math.random() * 9000);
  const encryptedPin = cryptrObject.encrypt(pin);
  sendVerificationMail(email, pin, function(error) {
    if (error) return res.json({
      error: true,
      mssg: error
    });
    const token_payload = {
      email: email,
      temp: true,
      pin: encryptedPin
    };
    jwt.sign(token_payload, APP_SECRET_KEY, { expiresIn: "2h" }, function(err, token) {
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
  });
});

router.post("/auth/android/verify", (req, res) => {
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
                roll_no: result.roll_no,
                college: decoded.college,
                name: result.username,
                scope: result.scope,
                channel : decoded.channel,
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
                college: decoded.college,
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

router.post("/auth/android/new-user", (req, res) => {
  verifyTempToken(req, (err, decoded) => {
    if(err) {
      return res.json({
        error: true,
        mssg: "Token Verification failed."
      });
    } else {
      if(decoded.newUser === true) {
        let roll_no = req.body.roll_no;
        let username = req.body.username;
        let email = req.body.email;
        let scope = req.body.scope;
        let college = req.body.college;
        let gender = req.body.gender;
        if(roll_no === undefined || username === undefined || email === undefined || scope === undefined || college === undefined || gender === undefined) {
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
          roll_no,
          username,
          email,
          scope,
          college,
          gender
        };
        dbo.collection(TABLE_USERS).replaceOne({
          roll_no
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
              name : username,
              roll_no,
              college,
              scope,
              user: true
            },
            APP_SECRET_KEY, {
              expiresIn: "100d"
            });
            return res.json({
              error: false,
              token: JWTToken,
              mssg: "updated"
            });
          }
        });
      } else {
        return res.json({
          error: true,
          mssg: "Token Verification failed."
        });
      }
    }
  });
});

router.post("/auth/android/manager/signin", (req, res) => {
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

module.exports = router;

// helper functions for auth routes, do not export these methods

function sendVerificationMail(reciever, pin, callback) {
  const html = {
    content: `<!DOCTYPE HTML PUBLIC "-//W3C//DTD XHTML 1.0 Transitional //EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"><html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office"><head>
    <!--[if gte mso 9]><xml>
     <o:OfficeDocumentSettings>
      <o:AllowPNG/>
      <o:PixelsPerInch>96</o:PixelsPerInch>
     </o:OfficeDocumentSettings>
    </xml><![endif]-->
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
    <meta name="viewport" content="width=device-width">
    <!--[if !mso]><!--><meta http-equiv="X-UA-Compatible" content="IE=edge"><!--<![endif]-->
    <title></title>
    <!--[if !mso]><!-- -->
	<link href="https://fonts.googleapis.com/css?family=Bitter" rel="stylesheet" type="text/css">
	<link href="https://fonts.googleapis.com/css?family=Open+Sans" rel="stylesheet" type="text/css">
	<!--<![endif]-->
    
    <style type="text/css" id="media-query">
      body {
  margin: 0;
  padding: 0; }

table, tr, td {
  vertical-align: top;
  border-collapse: collapse; }

.ie-browser table, .mso-container table {
  table-layout: fixed; }

* {
  line-height: inherit; }

a[x-apple-data-detectors=true] {
  color: inherit !important;
  text-decoration: none !important; }

[owa] .img-container div, [owa] .img-container button {
  display: block !important; }

[owa] .fullwidth button {
  width: 100% !important; }

[owa] .block-grid .col {
  display: table-cell;
  float: none !important;
  vertical-align: top; }

.ie-browser .num12, .ie-browser .block-grid, [owa] .num12, [owa] .block-grid {
  width: 605px !important; }

.ExternalClass, .ExternalClass p, .ExternalClass span, .ExternalClass font, .ExternalClass td, .ExternalClass div {
  line-height: 100%; }

.ie-browser .mixed-two-up .num4, [owa] .mixed-two-up .num4 {
  width: 200px !important; }

.ie-browser .mixed-two-up .num8, [owa] .mixed-two-up .num8 {
  width: 400px !important; }

.ie-browser .block-grid.two-up .col, [owa] .block-grid.two-up .col {
  width: 302px !important; }

.ie-browser .block-grid.three-up .col, [owa] .block-grid.three-up .col {
  width: 201px !important; }

.ie-browser .block-grid.four-up .col, [owa] .block-grid.four-up .col {
  width: 151px !important; }

.ie-browser .block-grid.five-up .col, [owa] .block-grid.five-up .col {
  width: 121px !important; }

.ie-browser .block-grid.six-up .col, [owa] .block-grid.six-up .col {
  width: 100px !important; }

.ie-browser .block-grid.seven-up .col, [owa] .block-grid.seven-up .col {
  width: 86px !important; }

.ie-browser .block-grid.eight-up .col, [owa] .block-grid.eight-up .col {
  width: 75px !important; }

.ie-browser .block-grid.nine-up .col, [owa] .block-grid.nine-up .col {
  width: 67px !important; }

.ie-browser .block-grid.ten-up .col, [owa] .block-grid.ten-up .col {
  width: 60px !important; }

.ie-browser .block-grid.eleven-up .col, [owa] .block-grid.eleven-up .col {
  width: 55px !important; }

.ie-browser .block-grid.twelve-up .col, [owa] .block-grid.twelve-up .col {
  width: 50px !important; }

@media only screen and (min-width: 625px) {
  .block-grid {
    width: 605px !important; }
  .block-grid .col {
    vertical-align: top; }
    .block-grid .col.num12 {
      width: 605px !important; }
  .block-grid.mixed-two-up .col.num4 {
    width: 200px !important; }
  .block-grid.mixed-two-up .col.num8 {
    width: 400px !important; }
  .block-grid.two-up .col {
    width: 302px !important; }
  .block-grid.three-up .col {
    width: 201px !important; }
  .block-grid.four-up .col {
    width: 151px !important; }
  .block-grid.five-up .col {
    width: 121px !important; }
  .block-grid.six-up .col {
    width: 100px !important; }
  .block-grid.seven-up .col {
    width: 86px !important; }
  .block-grid.eight-up .col {
    width: 75px !important; }
  .block-grid.nine-up .col {
    width: 67px !important; }
  .block-grid.ten-up .col {
    width: 60px !important; }
  .block-grid.eleven-up .col {
    width: 55px !important; }
  .block-grid.twelve-up .col {
    width: 50px !important; } }

@media (max-width: 625px) {
  .block-grid, .col {
    min-width: 320px !important;
    max-width: 100% !important;
    display: block !important; }
  .block-grid {
    width: calc(100% - 40px) !important; }
  .col {
    width: 100% !important; }
    .col > div {
      margin: 0 auto; }
  img.fullwidth, img.fullwidthOnMobile {
    max-width: 100% !important; }
  .no-stack .col {
    min-width: 0 !important;
    display: table-cell !important; }
  .no-stack.two-up .col {
    width: 50% !important; }
  .no-stack.mixed-two-up .col.num4 {
    width: 33% !important; }
  .no-stack.mixed-two-up .col.num8 {
    width: 66% !important; }
  .no-stack.three-up .col.num4 {
    width: 33% !important; }
  .no-stack.four-up .col.num3 {
    width: 25% !important; }
  .mobile_hide {
    min-height: 0px;
    max-height: 0px;
    max-width: 0px;
    display: none;
    overflow: hidden;
    font-size: 0px; } }

    </style>
</head>
<body class="clean-body" style="margin: 0;padding: 0;-webkit-text-size-adjust: 100%;background-color: #FFFFFF">
  <style type="text/css" id="media-query-bodytag">
    @media (max-width: 520px) {
      .block-grid {
        min-width: 320px!important;
        max-width: 100%!important;
        width: 100%!important;
        display: block!important;
      }

      .col {
        min-width: 320px!important;
        max-width: 100%!important;
        width: 100%!important;
        display: block!important;
      }

        .col > div {
          margin: 0 auto;
        }

      img.fullwidth {
        max-width: 100%!important;
      }
			img.fullwidthOnMobile {
        max-width: 100%!important;
      }
      .no-stack .col {
				min-width: 0!important;
				display: table-cell!important;
			}
			.no-stack.two-up .col {
				width: 50%!important;
			}
			.no-stack.mixed-two-up .col.num4 {
				width: 33%!important;
			}
			.no-stack.mixed-two-up .col.num8 {
				width: 66%!important;
			}
			.no-stack.three-up .col.num4 {
				width: 33%!important;
			}
			.no-stack.four-up .col.num3 {
				width: 25%!important;
			}
      .mobile_hide {
        min-height: 0px!important;
        max-height: 0px!important;
        max-width: 0px!important;
        display: none!important;
        overflow: hidden!important;
        font-size: 0px!important;
      }
    }
  </style>
  <!--[if IE]><div class="ie-browser"><![endif]-->
  <!--[if mso]><div class="mso-container"><![endif]-->
  <table class="nl-container" style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;min-width: 320px;Margin: 0 auto;background-color: #FFFFFF;width: 100%" cellpadding="0" cellspacing="0">
	<tbody>
	<tr style="vertical-align: top">
		<td style="word-break: break-word;border-collapse: collapse !important;vertical-align: top">
    <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td align="center" style="background-color: #FFFFFF;"><![endif]-->

    <div style="background-color:#49a6e8;">
      <div style="Margin: 0 auto;min-width: 320px;max-width: 605px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;" class="block-grid ">
        <div style="border-collapse: collapse;display: table;width: 100%;background-color:transparent;">
          <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="background-color:#49a6e8;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width: 605px;"><tr class="layout-full-width" style="background-color:transparent;"><![endif]-->

              <!--[if (mso)|(IE)]><td align="center" width="605" style=" width:605px; padding-right: 0px; padding-left: 0px; padding-top:0px; padding-bottom:0px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><![endif]-->
            <div class="col num12" style="min-width: 320px;max-width: 605px;display: table-cell;vertical-align: top;">
              <div style="background-color: transparent; width: 100% !important;">
              <!--[if (!mso)&(!IE)]><!--><div style="border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent; padding-top:0px; padding-bottom:0px; padding-right: 0px; padding-left: 0px;"><!--<![endif]-->

                  
                    
<table border="0" cellpadding="0" cellspacing="0" width="100%" class="divider " style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;min-width: 100%;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%">
    <tbody>
        <tr style="vertical-align: top">
            <td class="divider_inner" style="word-break: break-word;border-collapse: collapse !important;vertical-align: top;padding-right: 20px;padding-left: 20px;padding-top: 20px;padding-bottom: 20px;min-width: 100%;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%">
                <table class="divider_content" height="0px" align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;border-top: 0px solid transparent;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%">
                    <tbody>
                        <tr style="vertical-align: top">
                            <td style="word-break: break-word;border-collapse: collapse !important;vertical-align: top;font-size: 0px;line-height: 0px;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%">
                                <span>&#160;</span>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </td>
        </tr>
    </tbody>
</table>
                  
                  
                    <div class="">
	<!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 10px; padding-left: 10px; padding-top: 20px; padding-bottom: 30px;"><![endif]-->
	<div style="color:#FFFFFF;font-family:'Helvetica Neue', Helvetica, Arial, sans-serif;line-height:120%; padding-right: 10px; padding-left: 10px; padding-top: 20px; padding-bottom: 30px;">	
		<div style="line-height:14px;font-family:'Helvetica Neue', Helvetica, Arial, sans-serif;font-size:12px;color:#FFFFFF;text-align:left;"><p style="margin: 0;line-height: 14px;text-align: center;font-size: 12px"><span style="font-size: 50px; line-height: 60px;"><strong><span style="line-height: 60px; font-size: 50px;">Dock Inc.</span></strong></span></p></div>	
	</div>
	<!--[if mso]></td></tr></table><![endif]-->
</div>
                  
                  
                    <div class="">
	<!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 10px; padding-left: 10px; padding-top: 20px; padding-bottom: 30px;"><![endif]-->
	<div style="color:#FFFFFF;font-family:'Helvetica Neue', Helvetica, Arial, sans-serif;line-height:120%; padding-right: 10px; padding-left: 10px; padding-top: 20px; padding-bottom: 30px;">	
		<div style="font-size:12px;line-height:14px;font-family:'Helvetica Neue', Helvetica, Arial, sans-serif;color:#FFFFFF;text-align:left;"><p style="margin: 0;font-size: 14px;line-height: 17px;text-align: center"><span style="font-size: 28px; line-height: 33px;">Hey There, your verification code is <span style="font-size: 28px; line-height: 33px;"><strong>${pin}</strong></span></span></p></div>	
	</div>
	<!--[if mso]></td></tr></table><![endif]-->
</div>
                  
              <!--[if (!mso)&(!IE)]><!--></div><!--<![endif]-->
              </div>
            </div>
          <!--[if (mso)|(IE)]></td></tr></table></td></tr></table><![endif]-->
        </div>
      </div>
    </div>    <div style="background-color:#49a6e8;">
      <div style="Margin: 0 auto;min-width: 320px;max-width: 605px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;" class="block-grid ">
        <div style="border-collapse: collapse;display: table;width: 100%;background-color:transparent;">
          <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="background-color:#49a6e8;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width: 605px;"><tr class="layout-full-width" style="background-color:transparent;"><![endif]-->

              <!--[if (mso)|(IE)]><td align="center" width="605" style=" width:605px; padding-right: 0px; padding-left: 0px; padding-top:0px; padding-bottom:0px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><![endif]-->
            <div class="col num12" style="min-width: 320px;max-width: 605px;display: table-cell;vertical-align: top;">
              <div style="background-color: transparent; width: 100% !important;">
              <!--[if (!mso)&(!IE)]><!--><div style="border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent; padding-top:0px; padding-bottom:0px; padding-right: 0px; padding-left: 0px;"><!--<![endif]-->

                  
                    
<table border="0" cellpadding="0" cellspacing="0" width="100%" class="divider " style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;min-width: 100%;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%">
    <tbody>
        <tr style="vertical-align: top">
            <td class="divider_inner" style="word-break: break-word;border-collapse: collapse !important;vertical-align: top;padding-right: 20px;padding-left: 20px;padding-top: 20px;padding-bottom: 20px;min-width: 100%;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%">
                <table class="divider_content" height="0px" align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;border-top: 0px solid transparent;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%">
                    <tbody>
                        <tr style="vertical-align: top">
                            <td style="word-break: break-word;border-collapse: collapse !important;vertical-align: top;font-size: 0px;line-height: 0px;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%">
                                <span>&#160;</span>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </td>
        </tr>
    </tbody>
</table>
                  
              <!--[if (!mso)&(!IE)]><!--></div><!--<![endif]-->
              </div>
            </div>
          <!--[if (mso)|(IE)]></td></tr></table></td></tr></table><![endif]-->
        </div>
      </div>
    </div>    <div style="background-color:#f3f3f3;">
      <div style="Margin: 0 auto;min-width: 320px;max-width: 605px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;" class="block-grid ">
        <div style="border-collapse: collapse;display: table;width: 100%;background-color:transparent;">
          <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="background-color:#f3f3f3;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width: 605px;"><tr class="layout-full-width" style="background-color:transparent;"><![endif]-->

              <!--[if (mso)|(IE)]><td align="center" width="605" style="background-color:#FFFFFF; width:605px; padding-right: 0px; padding-left: 0px; padding-top:0px; padding-bottom:0px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><![endif]-->
            <div class="col num12" style="min-width: 320px;max-width: 605px;display: table-cell;vertical-align: top;">
              <div style="background-color: #FFFFFF; width: 100% !important;">
              <!--[if (!mso)&(!IE)]><!--><div style="border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent; padding-top:0px; padding-bottom:0px; padding-right: 0px; padding-left: 0px;"><!--<![endif]-->

                  
                    
<table border="0" cellpadding="0" cellspacing="0" width="100%" class="divider " style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;min-width: 100%;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%">
    <tbody>
        <tr style="vertical-align: top">
            <td class="divider_inner" style="word-break: break-word;border-collapse: collapse !important;vertical-align: top;padding-right: 5px;padding-left: 5px;padding-top: 5px;padding-bottom: 5px;min-width: 100%;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%">
                <table class="divider_content" align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;border-top: 0px solid transparent;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%">
                    <tbody>
                        <tr style="vertical-align: top">
                            <td style="word-break: break-word;border-collapse: collapse !important;vertical-align: top;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%">
                                <span></span>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </td>
        </tr>
    </tbody>
</table>
                  
                  
                    <div class="">
	<!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 30px; padding-left: 30px; padding-top: 30px; padding-bottom: 5px;"><![endif]-->
	<div style="color:#134C75;font-family:'Helvetica Neue', Helvetica, Arial, sans-serif;line-height:120%; padding-right: 30px; padding-left: 30px; padding-top: 30px; padding-bottom: 5px;">	
		<div style="font-size:12px;line-height:14px;font-family:'Helvetica Neue', Helvetica, Arial, sans-serif;color:#134C75;text-align:left;"><p style="margin: 0;font-size: 14px;line-height: 17px;text-align: center"><span style="font-size: 24px; line-height: 28px;"><strong>Got any Queries ?</strong></span></p></div>	
	</div>
	<!--[if mso]></td></tr></table><![endif]-->
</div>
                  
                  
                    <div class="">
	<!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 30px; padding-left: 30px; padding-top: 5px; padding-bottom: 20px;"><![endif]-->
	<div style="color:#7E7E7E;font-family:'Open Sans', Helvetica, Arial, sans-serif;line-height:150%; padding-right: 30px; padding-left: 30px; padding-top: 5px; padding-bottom: 20px;">	
		<div style="font-size:12px;line-height:18px;color:#7E7E7E;font-family:'Open Sans', Helvetica, Arial, sans-serif;text-align:left;"><p style="margin: 0;font-size: 14px;line-height: 21px;text-align: center">Please email your queries to support@mycampusdock.com, thank you.</p></div>	
	</div>
	<!--[if mso]></td></tr></table><![endif]-->
</div>
                  
                  
                    
<table border="0" cellpadding="0" cellspacing="0" width="100%" class="divider " style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;min-width: 100%;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%">
    <tbody>
        <tr style="vertical-align: top">
            <td class="divider_inner" style="word-break: break-word;border-collapse: collapse !important;vertical-align: top;padding-right: 10px;padding-left: 10px;padding-top: 20px;padding-bottom: 10px;min-width: 100%;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%">
                <table class="divider_content" height="0px" align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;border-top: 0px solid transparent;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%">
                    <tbody>
                        <tr style="vertical-align: top">
                            <td style="word-break: break-word;border-collapse: collapse !important;vertical-align: top;font-size: 0px;line-height: 0px;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%">
                                <span>&#160;</span>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </td>
        </tr>
    </tbody>
</table>
                  
                  
                    <div align="center" class="img-container center  autowidth  " style="padding-right: 0px;  padding-left: 0px;">
<!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr style="line-height:0px;line-height:0px;"><td style="padding-right: 0px; padding-left: 0px;" align="center"><![endif]-->
  <img class="center  autowidth " align="center" border="0" src="https://d1oco4z2z1fhwp.cloudfront.net/templates/default/48/marketing-template_bottom-article.jpg" alt="Image" title="Image" style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: block !important;border: 0;height: auto;float: none;width: 100%;max-width: 600px" width="600">
<!--[if mso]></td></tr></table><![endif]-->
</div>

                  
              <!--[if (!mso)&(!IE)]><!--></div><!--<![endif]-->
              </div>
            </div>
          <!--[if (mso)|(IE)]></td></tr></table></td></tr></table><![endif]-->
        </div>
      </div>
    </div>    <div style="background-color:#f3f3f3;">
      <div style="Margin: 0 auto;min-width: 320px;max-width: 605px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;" class="block-grid ">
        <div style="border-collapse: collapse;display: table;width: 100%;background-color:transparent;">
          <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="background-color:#f3f3f3;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width: 605px;"><tr class="layout-full-width" style="background-color:transparent;"><![endif]-->

              <!--[if (mso)|(IE)]><td align="center" width="605" style=" width:605px; padding-right: 0px; padding-left: 0px; padding-top:5px; padding-bottom:5px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><![endif]-->
            <div class="col num12" style="min-width: 320px;max-width: 605px;display: table-cell;vertical-align: top;">
              <div style="background-color: transparent; width: 100% !important;">
              <!--[if (!mso)&(!IE)]><!--><div style="border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent; padding-top:5px; padding-bottom:5px; padding-right: 0px; padding-left: 0px;"><!--<![endif]-->

                  
                    
<table border="0" cellpadding="0" cellspacing="0" width="100%" class="divider " style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;min-width: 100%;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%">
    <tbody>
        <tr style="vertical-align: top">
            <td class="divider_inner" style="word-break: break-word;border-collapse: collapse !important;vertical-align: top;padding-right: 10px;padding-left: 10px;padding-top: 30px;padding-bottom: 30px;min-width: 100%;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%">
                <table class="divider_content" align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;border-top: 1px solid #DDDDDD;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%">
                    <tbody>
                        <tr style="vertical-align: top">
                            <td style="word-break: break-word;border-collapse: collapse !important;vertical-align: top;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%">
                                <span></span>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </td>
        </tr>
    </tbody>
</table>
                  
                  
                    <div class="">
	<!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 10px;"><![endif]-->
	<div style="color:#555555;font-family:'Open Sans', Helvetica, Arial, sans-serif;line-height:180%; padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 10px;">	
		<div style="font-size:12px;line-height:22px;color:#555555;font-family:'Open Sans', Helvetica, Arial, sans-serif;text-align:left;"><p style="margin: 0;font-size: 14px;line-height: 25px"><i>This is a auto-generated email from our registration server,&#160; if you did not request this registration request please feel free to ignore this email.</i></p></div>	
	</div>
	<!--[if mso]></td></tr></table><![endif]-->
</div>
                  
                  
                    
<table border="0" cellpadding="0" cellspacing="0" width="100%" class="divider " style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;min-width: 100%;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%">
    <tbody>
        <tr style="vertical-align: top">
            <td class="divider_inner" style="word-break: break-word;border-collapse: collapse !important;vertical-align: top;padding-right: 25px;padding-left: 25px;padding-top: 25px;padding-bottom: 25px;min-width: 100%;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%">
                <table class="divider_content" height="0px" align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;border-top: 0px solid transparent;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%">
                    <tbody>
                        <tr style="vertical-align: top">
                            <td style="word-break: break-word;border-collapse: collapse !important;vertical-align: top;font-size: 0px;line-height: 0px;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%">
                                <span>&#160;</span>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </td>
        </tr>
    </tbody>
</table>
                  
              <!--[if (!mso)&(!IE)]><!--></div><!--<![endif]-->
              </div>
            </div>
          <!--[if (mso)|(IE)]></td></tr></table></td></tr></table><![endif]-->
        </div>
      </div>
    </div>    <div style="background-color:transparent;">
      <div style="Margin: 0 auto;min-width: 320px;max-width: 605px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;" class="block-grid mixed-two-up ">
        <div style="border-collapse: collapse;display: table;width: 100%;background-color:transparent;">
          <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="background-color:transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width: 605px;"><tr class="layout-full-width" style="background-color:transparent;"><![endif]-->

              <!--[if (mso)|(IE)]><td align="center" width="403" style=" width:403px; padding-right: 0px; padding-left: 0px; padding-top:15px; padding-bottom:15px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><![endif]-->
            <div class="col num8" style="display: table-cell;vertical-align: top;min-width: 320px;max-width: 400px;">
              <div style="background-color: transparent; width: 100% !important;">
              <!--[if (!mso)&(!IE)]><!--><div style="border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent; padding-top:15px; padding-bottom:15px; padding-right: 0px; padding-left: 0px;"><!--<![endif]-->

                  
                    <div class="">
	<!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 10px;"><![endif]-->
	<div style="color:#8F8F8F;font-family:'Open Sans', Helvetica, Arial, sans-serif;line-height:120%; padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 10px;">	
		<div style="font-size:12px;line-height:14px;color:#8F8F8F;font-family:'Open Sans', Helvetica, Arial, sans-serif;text-align:left;"><p style="margin: 0;font-size: 14px;line-height: 17px"><span style="font-size: 11px; line-height: 13px;">Copyright © 2018 Dock, All rights reserved. </span><br></p></div>	
	</div>
	<!--[if mso]></td></tr></table><![endif]-->
</div>
                  
              <!--[if (!mso)&(!IE)]><!--></div><!--<![endif]-->
              </div>
            </div>
              <!--[if (mso)|(IE)]></td><td align="center" width="202" style=" width:202px; padding-right: 10px; padding-left: 10px; padding-top:15px; padding-bottom:15px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><![endif]-->
            <div class="col num4" style="display: table-cell;vertical-align: top;max-width: 320px;min-width: 200px;">
              <div style="background-color: transparent; width: 100% !important;">
              <!--[if (!mso)&(!IE)]><!--><div style="border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent; padding-top:15px; padding-bottom:15px; padding-right: 10px; padding-left: 10px;"><!--<![endif]-->

                  
                    &#160;
                  
              <!--[if (!mso)&(!IE)]><!--></div><!--<![endif]-->
              </div>
            </div>
          <!--[if (mso)|(IE)]></td></tr></table></td></tr></table><![endif]-->
        </div>
      </div>
    </div>   <!--[if (mso)|(IE)]></td></tr></table><![endif]-->
		</td>
  </tr>
  </tbody>
  </table>
  <!--[if (mso)|(IE)]></div><![endif]-->


</body></html>`
  };
  var subject = "Verify your E-mail";
  sendEmailHtml(reciever, subject, html.content, function(error) {
    callback(error);
  });
}