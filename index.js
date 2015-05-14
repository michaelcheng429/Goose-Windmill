var app = require('./server/server.js');
var port = process.env.HACKFEED_PORT || 3000;

app.listen(port);

var http = require("http");
setInterval(function() {
    http.get("http://hnmobileapp.herokuapp.com");
}, 600000); // every 10 minutes (600000)

var http = require("http");
setInterval(function() {
    http.get("http://goosewindmill.herokuapp.com");
}, 600000); // every 10 minutes (600000)

console.log("Server running on port: " + port + "/\nCTRL + C to shutdown");