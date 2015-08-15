var CronJob = require('cron').CronJob;

var CenterCode = require('./centercode');
var centercode = new CenterCode();

var param = require('./param');

var Geckoboard = require('./geckoboard');
var geckoboard = new Geckoboard();

var url_preview_site = 'http://preview.beta.autodesk.com/cai/005/User.asmx?WSDL';
var url_live_site = 'http://beta.autodesk.com/cai/005/User.asmx?WSDL';

var param_cc;
var data_pre;

var mongodb = require('./database');
var Schema = mongodb.mongoose.Schema;
var projectSchema = new Schema({
  project: String,
  total_Forum_Posts: Number,
  download_Alpha1: Number,
  date: Date
});
var Project = mongodb.mongoose.model('Project', projectSchema);

var proj_database = new Project({
  project: 'AutoCAD Customer Council',
  total_Forum_Posts: 0,
  download_Alpha1: 0
});

updateDatabase = function(data) {
  proj_database.total_Forum_Posts = data;
  console.log('start to udpate database.')
  proj_database.save(function(err){
    if (err) throw err;
    console.log('Database successfully updated.');
  });
};

queryDatabase = function(callback) {
  Project.find({}, function(err, res){
    if (err) throw err;
    console.log("Database results:", res);
    callback(err, res);
  });
};

runRightNow = function() {
  param_cc = param.viewFilterParams_CEM_Nautilus_Alpha1_Download_x64;
  console.log('Start Total Forum Posts Query.');

  centercode.getData(url_live_site, param_cc, function(data){
    var download_counts = 0;
    for (var i = 0; i < data.length; i++) {
      if (data[i]['AutoCAD Nautilus Alpha 1 - 64bit  (1 of 2)'] == 2) {
        download_counts++;
      }
    }
    console.log("Download Numbers:", download_counts);

    var data_current = download_counts;
    data_pre = 0;
    geckoboard.geckoPush(data_current, data_pre, "Alpha1 64bit Download");
    //console.log(data);
    console.log('Complete Total Forum Posts Push.');
  });
};

runRightNow();

/*
var job_Total_Forum_Posts = new CronJob('00 * * * * 0-6', function(){
  // Run everyday at 12:00:00 AM
  queryDatabase(function(err, res){
    data_pre = res[0]['total_Forum_Posts'];
    console.log("Database Query:", res[0]['total_Forum_Posts']);
  });

  param_cc = param.viewFilterParams_CEM_Total_User_Form_Posts;
  console.log('Start Total Forum Posts Query.');

  centercode.getData(url_live_site, param_cc, function(data){
    var data_current = data[1]['# of Total User Forum Posts'];

    geckoboard.geckoPush(data_current, data_pre, "Total Forum Posts");
    console.log("Data from CenterCode:", data_current);
    console.log('Complete Total Forum Posts Push.');

    updateDatabase(data_current, function() {
      proj_database.find({},function(err, res){
        if (err) throw err;
        console.log("database result:", res);
      });
    });
  });
},
null,
true, // Start the job right now
"America/Los_Angeles");
*/

/*
var job_Total_Forum_Posts = new CronJob('00 * * * * 0-6', function(){
  // Run everyday at 12:00:00 AM
  queryDatabase(function(err, res){
    data_pre = res[0]['total_Forum_Posts'];
    console.log("Database Query:", res[0]['total_Forum_Posts']);
  });

  param_cc = param.viewFilterParams_CEM_Nautilus_Alpha1_Download_x64;
  console.log('Start Total Forum Posts Query.');

  centercode.getData(url_live_site, param_cc, function(data){
    var download_counts = 0;
    for (var i = 0; i < data.length; i++) {
      if (data[i]['AutoCAD Nautilus Alpha 1 - 64bit  (1 of 2)'] == 2) {
        download_counts++;
      }
    }
    console.log("Download Numbers:", download_counts);

    //geckoboard.geckoPush(data_current, data_pre, "Alpha1 64bit Download");
    //console.log(data);
    console.log('Complete Total Forum Posts Push.');

    updateDatabase(data_current, function() {
      proj_database.find({},function(err, res){
        if (err) throw err;
        console.log("database result:", res);
      });
    });

  });
},
null,
true, // Start the job right now
"America/Los_Angeles");
*/

/*
var job_User_Distribution = new CronJob('30 * * * * 0-6', function(){
  // Run everyday at 12:00:00 AM
  param_cc = param.viewFilterParams_CEM_User_Distribution;
  console.log('Start User Distribution Query.');
  centercode.getData(url_live_site, param_cc, function(data){
    geckoboard.geckoPush(data, "User Distribution");
  });
  console.log('Complete User Distribution Push.');
  // Pull data from CenterCode website
},
null,
true, // Start the job right now
"America/Los_Angeles");
*/
