var mongoose = require('mongoose');

// DB to store graph data
var GraphSchema = mongoose.Schema({
  storyId: {
    type: String,
    required: true,
    unique: true
  },
  graph: {
    type: Object,
    required: true
  }
});

var Graph = mongoose.model('graphs', GraphSchema);

module.exports = Graph;