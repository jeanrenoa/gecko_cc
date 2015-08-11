// Use mongoose to access database based on MongoDB
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/database')
var Schema = mongoose.Schema;

var projectSchema = new Schema({
  project: String,
  total_Forum_Posts: Number,
  download_Alpha1: Number,
  date: Date
});

var Project = mongoose.model('Project',projectSchema);

module.exports = Project;
