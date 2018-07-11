const jwt = require("jsonwebtoken");
const SECRET = "KmnIIN60jZSN4wWXN52F-dope";
// Token verification methods
exports.signToken = function(payload, expiresIn, callback) {
  jwt.sign( payload, SECRET, { expiresIn }, function(err, token) {
    if(err) {
      callback(true);
    } else {
      callback(false, token);
    }
  });
};

// exports.verifyToken = function(token) {

// };