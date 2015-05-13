var Cache = require('./cacheModel.js');

var defaultCorsHeaders = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, accept",
  "access-control-max-age": 10 // Seconds.
};

module.exports = {
  topStories: function(request, response) {
    Cache.getTopStories(function(err,results){
        if(!err){
          response.set(defaultCorsHeaders);
          response.json(results);
        }else{
          response.status(500).send(err);
        }
    });
  }
};

// Initialize and refresh the top story data every two minutes
Cache.updateTopStories();
setInterval(Cache.updateTopStories, 120000);