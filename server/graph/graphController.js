var Graph = require('./graphModel.js');
var request = require('request');

var GraphController = {};

//Set headers
var headers = {
  'User-Agent': 'Hacker Feed',
  'Content-Type': 'application/json'  
};

// fetch graph data for a user via API calls and put it in DB
// TODO: store story data in DB and fetch from DB if it hasn't changed
// (instead of sending an API request)
GraphController.fetch = function (req, res, next) {
  console.log(req.query);
  var storyId = req.query.storyId || '9546311';
  var queryUrl = 'http://hn.algolia.com/api/v1/items/' + storyId;
  //var queryUrl = 'https://hacker-news.firebaseio.com/v0/item/' + storyId + '.json?print=pretty';
  var options = {
    url: queryUrl,
    method: 'GET',
    headers: headers
  };

  // Perform the firebase API request
  request(options, function(error, response, html){
    var data = JSON.parse(response.body);
    res.status(200).send(data);
  });
  
};

module.exports = GraphController;