var User = require('./userModel.js');
var jwt = require('jwt-simple');

module.exports = {
  app: {},
  //Handles new user account generation
  signup: function(request, response, next) {

    var username = request.body.username;
    var password = request.body.password;
    var following = request.body.following;
  
    var params = {
      username: username,
      password: password,
      following: following
    };

    //First, determine if the username is available
    User.findOne({username: username}, function(err, user) {
      //User already exists, try again!
      if(user) {
        //Figure out a way for the client to redirect to the signup page
        //and inform the user that this username is already in use.
        response.status(400).send('Username already exists');
      } else {
        //If it is not in use, create the user in the database
        User.prototype.createUser(params, function(err){
          if(!err){
            var token = jwt.encode({user: username}, module.exports.app.get('jwtTokenSecret'));
            console.log('token: ' + token);
            response.status(200).send({token: token});
          } else {
            response.status(400).send(err);
          }
        });
      }
    });    
  },

  //Interact with the database to validate username/password combination
  signin: function(request, response, next) {
    var username = request.body.username;
    var password = request.body.password;

    User.prototype.signin(username, password, function(err, results){
      if(!err){
        console.log('Signed in');
        console.log(results);
        var token = jwt.encode({user: username}, module.exports.app.get('jwtTokenSecret'));
        console.log('token: ' + token);
        response.status(200).send({followers: results, token: token});
      } else {
        console.log('Sign In error');
        response.status(400).send(err);
      }
    })
  },

  //Controller tells the model to update the database when the user adds or 
  //removes users from their following list
  updateFollowing: function(request, response, next) {
    if (!request.user) {
        console.log('Not authenticated');
        response.status(400).send('Not authenticated');
    }
    var username = request.user.username;
    var following = request.body.following;

    User.prototype.updateFollowing(username, following, function(err, results){
      if(!err){
        console.log('User following data updated');
        response.status(200).end();
      } else {
        console.log('User following data update ERROR');
        response.status(400).send(err);
      }
    });
  }
};