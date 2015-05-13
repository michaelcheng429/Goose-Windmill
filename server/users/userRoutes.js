var userController = require('./userController.js')
var checkAuth = require('../utils/checkAuth.js');

module.exports = function (app, router) {
  //Router routing to the controller
  userController.app = app;
  router
    .post('/signup', userController.signup)
    .post('/signin', userController.signin)
    .post('/updateFollowing', checkAuth, userController.updateFollowing)
}