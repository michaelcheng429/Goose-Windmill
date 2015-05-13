var UserModel = require('../users/userModel');
var jwt = require('jwt-simple');
 
module.exports = function(req, res, next) {
  var token = (req.body && req.body.access_token) || (req.query && req.query.access_token) || req.headers['x-access-token'];

  if (token) {
    try {
      var decoded = jwt.decode(token, 'PROVOLONE');
   
      UserModel.findOne({ username: decoded.user }, function(err, user) {
        req.user = user;
        next();
      });
   
    } catch (err) {
      console.log(err);
      return next();
    }
  } else {
    next();
  }
};