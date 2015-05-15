var graphController = require('./graphController.js')
var checkAuth = require('../utils/checkAuth.js');

module.exports = function (app, router) {
  //Router routing to the controller
  router
    .get('/fetch', graphController.fetch);
}