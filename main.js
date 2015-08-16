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

// Define the Schema for different collections in Database
var Schema = mongodb.mongoose.Schema;
var projectSchema = new Schema({
  project: String,
  total_Forum_Posts: Number,
  download_Alpha1: Number,
  total_Project_Login: Number,
  date: Date,
  baseline: Boolean,
  Week: Number
});

var Project = mongodb.mongoose.model('Project', projectSchema);

var proj_database = new Project({
  project: 'AutoCAD Customer Council'
});

updateDatabase = function(key, data, date, callback) {
  proj_database.date = date;
  switch (key) {
    case "total_Project_Login":
      proj_database.total_Project_Login = data;
      break;
    case "total_Forum_Posts":
      proj_database.total_Forum_Posts = data;
      break;
    case "download_Alpha1":
      proj_database.download_Alpha1 = data;
      break;
    default:

  }
  console.log('start to udpate database.')
  proj_database.save(function(err){
    if (err) throw err;
    console.log('Database successfully updated.');
  });
  callback();
};

queryDatabase = function(callback) {
  Project.find({}, function(err, res){
    if (err) throw err;
    console.log("Database results:", res);
    callback(err, res);
  });
};

/*
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
*/

var getDateToday = function() {
  var now = new Date();
  var year = now.getFullYear();
  var month = now.getMonth();
  var date = now.getDate();
  if (month < 10) {
    month = "0" + month;
  }
  if (date < 10) {
    date = "0" + date;
  }
  var today = year + "-" + month + "-" + date;
  console.log("Today is", today);
  return today;
};

runRightNow = function() {
  var today = getDateToday();

  param_cc = param.viewFilterParams_CEM_Project_Login;
  console.log('Start Total Forum Posts Query.');

  centercode.getData(url_live_site, param_cc, function(data){
    var login_counts = 0;
    for (var i = 0; i < data.length; i++) {
      if (data[i]['# of Project Logins'] != null) {
        login_counts = login_counts + parseInt(data[i]['# of Project Logins']);
      }
    }
    console.log("Login Numbers:", login_counts);

    var data_current = [];
    data_current[0] = [today, login_counts];
    data_current[1] = ["2015-07-17", 2000];
    data_current[2] = ["2015-07-18", 1400];
    data_pre = 0;
    geckoboard.geckoPush(data_current, data_pre, "Total Project Login");

    //console.log(data);
    console.log('Complete Total Forum Posts Push.');

    updateDatabase("total_Project_Login", login_counts, today, function() {
      console.log("Start to display Database.")
      Project.find({}, function(err, res){
        if (err) throw err;
        console.log("database result:", res);
      });
    });

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
var job_Alpha_Download = new CronJob('00 * * * * 0-6', function(){
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
