const APP_SECRET_KEY = "KmnIIN60jZSN4wWXN52F-dope";

const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
// only token verification happens here, do not sign tokens here

const smtpTransport = nodemailer.createTransport({
  host: "sg1-ls1.a2hosting.com", // this domain for all TLS communication with server services
  port: 465,
  secure: true,
  auth: {
    user: "support@mycampusdock.com",
    pass: "D@ckD@ck"
  }
});

exports.sendEmailHtml = function(reciever, subject, html, callback) {
  var mailOptions = {
    from: "\"Campus Dock\" <support@mycampusdock.com>",
    to: reciever,
    subject: subject,
    html
  };
  smtpTransport.sendMail(mailOptions, function(error) {
    callback(error);
  });
};

exports.verifyTempToken = function(req, callback) {
  var token = req.headers["x-access-token"];
  if (!token) return callback(true);
  jwt.verify(token, APP_SECRET_KEY, function(err, decoded) {
    if (err) return callback(true);
    if ( decoded && decoded.temp === true ) return callback(false, decoded);
    return callback(true);
  });
};
exports.verifyToken = function(req, callback) {
  var token = req.headers["x-access-token"];
  if (!token) return callback(true);
  jwt.verify(token, APP_SECRET_KEY, function(err, decoded) {
    if (err) return callback(true);
    if ( decoded && decoded.temp === true ) return callback(true);
    return callback(false, decoded);
  });
};