// Use mongoose to access database based on MongoDB
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/database');

exports.mongoose = mongoose;
