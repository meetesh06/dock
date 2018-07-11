const express = require("express");
const emailValidator = require("email-validator");
const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");

const smtpTransport = nodemailer.createTransport({
  host: "mail.mycampusdock.com",
  port: 465,
  secure: true,
  auth: {
    user: "support@mycampusdock.com",
    pass: "D@ckD@ck"
  }
});
const signToken = require("../../actions/actions");
const router = express.Router();



// middlewares here
router.use(bodyParser.json()); // support json encoded bodies
router.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies


// DOCUMENTATION
// Here we take care of the distribution of the tokens  
// Things to consider: 
//  This API is responsible for the safety of all the other routes
//  Changes here will barely be changed, so no loose ends here
//  Always check the return type of functions that are not written by you
// Event Creation

router.post("/auth/android/signin", (req, res) => {
  console.log(req.body);
  if (!req.body) return res.json({
    error: true,
    mssg: "missing fields"
  });
  const email = req.body.email;
  const college = req.body.college;
  if ( email === undefined || college === undefined ) {
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
  // all integrity checks completed

  var pin = Math.floor(1000 + Math.random() * 9000);
  sendVerificationMail(email, pin, function(error) {
    if (error) return res.json({
      error: true,
      mssg: error
    });

    const JWTToken = jwt.sign({
      email: email,
      pin: pin,
      college
    },
    APP_SECRET_KEY, {
      expiresIn: "2h"
    });
    return res.status(200).json({
      error: false,
      token: JWTToken
    });
  });
});

router.post("/android/signin/verify", (req, res) => {
  var token = req.headers["x-access-token"];
  if (!token) return res.status(200).send({
    error: true,
    mssg: "No token provided."
  });

  jwt.verify(token, APP_SECRET_KEY, function(err, decoded) {
    if (err) return res.status(200).send({
      error: true,
      message: err
    });
    if (decoded.pin == req.body.pin && decoded.email == req.body.email) {
      checkUserExists(decoded.email, (err, data) => {
        if (!err) {
          if (data) {
            const token = jwt.sign({
              email: req.body.email,
              college: decoded.college,
              name: data.username,
              scope: data.scope
            },
            APP_SECRET_KEY, {
              expiresIn: "100d"
            });
            return res.status(200).json({
              error: false,
              token: token,
              data: data ? data : {}
            });
          } else
            return res.status(200).json({
              error: false,
              token: token,
              data: data ? data : {}
            });
        } else {
          return res.status(200).json({
            error: true,
            mssg: err
          });
        }
      });

    } else {
      return res.status(200).json({
        error: true,
        mssg: "Not valid credentials!"
      });
    }
  });
});

module.exports = router;

// functions

function sendVerificationMail(reciever, pin, callback) {
  var text = "This is your verification PIN : " + pin + ".\nThis PIN is valid for 2 hours only.\nNever share your PIN with anyone. If you didn't requested PIN, please ignore!";
  let email = `
  <!DOCTYPE HTML PUBLIC "-//W3C//DTD XHTML 1.0 Transitional //EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"><html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office"><head>
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

.dock {
font-family: sans-serif;
font-size: 30px;
}

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
                
                
<div align="center" class="img-container center  autowidth  " style="padding-right: 0px;  padding-left: 0px;">
<h1 class="dock">Dock</h1>
</div>

                
                
                  <div class="">
<!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 10px; padding-left: 10px; padding-top: 20px; padding-bottom: 10px;"><![endif]-->
<div style="color:#FFFFFF;font-family:'Bitter', Georgia, Times, 'Times New Roman', serif;line-height:120%; padding-right: 10px; padding-left: 10px; padding-top: 20px; padding-bottom: 10px;">	
  <div style="font-size:12px;line-height:14px;font-family:Bitter, Georgia, Times, 'Times New Roman', serif;color:#FFFFFF;text-align:left;"><p style="margin: 0;font-size: 14px;line-height: 17px;text-align: center"><span style="font-size: 24px; line-height: 28px;">Hey, thanks for registering here's your pin</span><span style="font-size: 28px; line-height: 33px;"></span></p></div>	
</div>
<!--[if mso]></td></tr></table><![endif]-->
</div>
                
                
                  <div class="">
<!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 10px;"><![endif]-->
<div style="color:#acd6f4;font-family:'Open Sans', Helvetica, Arial, sans-serif;line-height:150%; padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 10px;">	
  <div style="font-size:12px;line-height:18px;text-align:center;color:#acd6f4;font-family:'Open Sans', Helvetica, Arial, sans-serif;"><p style="margin: 0;font-size: 12px;line-height: 18px;text-align: center"><span style="color: rgb(255, 255, 255); font-size: 30px; line-height: 45px;">Verification Pin: <strong>${pin}</strong></span><br data-mce-bogus="1"></p></div>	
</div>
<!--[if mso]></td></tr></table><![endif]-->
</div>
                
                
                  
<table border="0" cellpadding="0" cellspacing="0" width="100%" class="divider " style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;min-width: 100%;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%">
  <tbody>
      <tr style="vertical-align: top">
          <td class="divider_inner" style="word-break: break-word;border-collapse: collapse !important;vertical-align: top;padding-right: 20px;padding-left: 20px;padding-top: 20px;padding-bottom: 20px;min-width: 100%;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%">
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

            <!--[if (mso)|(IE)]><td align="center" width="605" style=" width:605px; padding-right: 0px; padding-left: 0px; padding-top:0px; padding-bottom:0px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><![endif]-->
          <div class="col num12" style="min-width: 320px;max-width: 605px;display: table-cell;vertical-align: top;">
            <div style="background-color: transparent; width: 100% !important;">
            <!--[if (!mso)&(!IE)]><!--><div style="border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent; padding-top:0px; padding-bottom:0px; padding-right: 0px; padding-left: 0px;"><!--<![endif]-->

                
                  
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
  </div>    <div style="background-color:#f3f3f3;">
    <div style="Margin: 0 auto;min-width: 320px;max-width: 605px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;" class="block-grid ">
      <div style="border-collapse: collapse;display: table;width: 100%;background-color:transparent;">
        <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="background-color:#f3f3f3;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width: 605px;"><tr class="layout-full-width" style="background-color:transparent;"><![endif]-->

            <!--[if (mso)|(IE)]><td align="center" width="605" style=" width:605px; padding-right: 0px; padding-left: 0px; padding-top:5px; padding-bottom:5px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><![endif]-->
          <div class="col num12" style="min-width: 320px;max-width: 605px;display: table-cell;vertical-align: top;">
            <div style="background-color: transparent; width: 100% !important;">
            <!--[if (!mso)&(!IE)]><!--><div style="border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent; padding-top:5px; padding-bottom:5px; padding-right: 0px; padding-left: 0px;"><!--<![endif]-->

                
                  <div class="">
<!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 10px;"><![endif]-->
<div style="color:#134C75;font-family:'Bitter', Georgia, Times, 'Times New Roman', serif;line-height:120%; padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 10px;">	
  <div style="font-size:12px;line-height:14px;font-family:Bitter, Georgia, Times, 'Times New Roman', serif;color:#134C75;text-align:left;"><p style="margin: 0;font-size: 14px;line-height: 17px"><strong><span style="font-size: 28px; line-height: 33px;">Got a problem ?</span></strong><br></p></div>	
</div>
<!--[if mso]></td></tr></table><![endif]-->
</div>
                
                
                  <div class="">
<!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 10px;"><![endif]-->
<div style="color:#555555;font-family:'Open Sans', Helvetica, Arial, sans-serif;line-height:150%; padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 10px;">	
  <div style="font-size:12px;line-height:18px;color:#555555;font-family:'Open Sans', Helvetica, Arial, sans-serif;text-align:left;"><p style="margin: 0;font-size: 14px;line-height: 21px">This is a auto generated email, if you did not initiate this request this please ignore this email.</p></div>	
</div>
<!--[if mso]></td></tr></table><![endif]-->
</div>
                
                
                  <div class="">
<!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 10px;"><![endif]-->
<div style="color:#555555;font-family:'Open Sans', Helvetica, Arial, sans-serif;line-height:150%; padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 10px;">	
  <div style="font-size:12px;line-height:18px;color:#555555;font-family:'Open Sans', Helvetica, Arial, sans-serif;text-align:left;"><p style="margin: 0;font-size: 12px;line-height: 18px"><br data-mce-bogus="1"></p></div>	
</div>
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

                
                  <div class="">
<!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 10px;"><![endif]-->
<div style="color:#555555;font-family:'Open Sans', Helvetica, Arial, sans-serif;line-height:150%; padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 10px;">	
  <div style="font-size:12px;line-height:18px;color:#555555;font-family:'Open Sans', Helvetica, Arial, sans-serif;text-align:left;"><p style="margin: 0;font-size: 14px;line-height: 21px">support@mycampusdock.com</p><p style="margin: 0;font-size: 14px;line-height: 21px">©2018 - Dock</p></div>	
</div>
<!--[if mso]></td></tr></table><![endif]-->
</div>
                
                
                  <div class="">
<!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 10px;"><![endif]-->
<div style="color:#555555;font-family:'Open Sans', Helvetica, Arial, sans-serif;line-height:150%; padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 10px;">	
  <div style="font-size:12px;line-height:18px;color:#555555;font-family:'Open Sans', Helvetica, Arial, sans-serif;text-align:left;"><p style="margin: 0;font-size: 12px;line-height: 18px"><br data-mce-bogus="1"></p></div>	
</div>
<!--[if mso]></td></tr></table><![endif]-->
</div>
                
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


</body></html>
  
  `;
  var subject = "Verify your E-mail";
  mail(reciever, subject, text, function(error) {
    callback(error);
  });
}

function mail(reciever, subject, text, callback) {
  var mailOptions = {
    from: "\"Campus Dock\" <support@mycampusdock.com>",
    to: reciever,
    subject: subject,
    text: text
  };
  console.log("email send request ", mailOptions);
  smtpTransport.sendMail(mailOptions, function(error, response) {
    console.log(error, response);
    // callback(error);
  });
}
