var CronJob = require('cron').CronJob;

var CenterCode = require('./centercode');
var centercode = new CenterCode();

var param = require('./param');

var Geckoboard = require('./geckoboard');
var geckoboard = new Geckoboard();

var async = require('async');

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
  total_download_Alpha1: Number,
  total_Project_Login: Number,
  date: String,
  baseline: Boolean,
  Week: Number
});

var Project = mongodb.mongoose.model('Project', projectSchema);

var results_database;  // Store the result queried from database

updateDatabase = function(key, data, date, callback) {

  console.log('Start to update database.')

  Project.findOne({date: date}, function(err, res){
    if (err) throw err;

    var array = [];
    array = res;
    console.log("Database Query:", array);

    if (array == null) {
      // No record by condition, directly save the current data
      var proj_database = new Project({
        project: 'AutoCAD Customer Council'
      });
      proj_database.date = date;

      switch (key) {
        case "total_Project_Login":
          proj_database.total_Project_Login = data;
          break;
        case "total_Forum_Posts":
          proj_database.total_Forum_Posts = data;
          break;
        case "total_download_Alpha1":
          proj_database.total_download_Alpha1 = data;
          break;
        default:

      }

      proj_database.save(function(err){
        if (err) throw err;
        console.log('Database successfully saved.');
      });
    }
    else {
      // Find the data by condition, need to update database
      switch (key) {
        case "total_Project_Login":
          res.total_Project_Login = data;
          break;
        case "total_Forum_Posts":
          res.total_Forum_Posts = data;
          break;
        case "total_download_Alpha1":
          res.total_download_Alpha1 = data;
          break;
        default:
      }
      res.save(function(err) {
        if (err) throw err;
        console.log("Database updated accordingly.")
      });
    }
  });

  callback();
};

queryDatabase = function(callback) {
  Project.find({}, function(err, res){
    if (err) throw err;
    console.log("Database results:", res, typeof res);
    callback(err, res);
  });
};

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
  return today;
};

var getLastDate = function(n) {
  var now = new Date();
  var year = now.getFullYear();
  var month = now.getMonth();
  var date = now.getDate() - n;
  if (month < 10) {
    month = "0" + month;
  }
  if (date < 10) {
    date = "0" + date;
  }
  var Last_N_date = year + "-" + month + "-" + date;
  return Last_N_date;
};

var getFormattedDate = function(date) {
  var year = date.getFullYear();
  var month = date.getMonth()+1;
  var date = date.getDate();
  if (month < 10) {
    month = "0" + month;
  }
  if (date < 10) {
    date = "0" + date;
  }
  return (year + "-" + month + "-" + date);
};

var jobNumberForumPost = function() {
  var today = getDateToday();
  console.log("Today is", today);

  queryDatabase(function(err, res){
    results_database = [];
    results_database = res;

    if (results_database.length == 0) {
      console.log("Nothing in database now.");
    }
    else {
      console.log("Query:", res[0]["date"]);
    }
    console.log("Database Query completes.");
  });

  param_cc = param.viewFilterParams_CEM_Total_User_Form_Posts;
  console.log('Start Total Forum Posts Query.');

  centercode.getData(url_live_site, param_cc, function(data){
    var data_current = data[1]['# of Total User Forum Posts'];
    console.log("Download Numbers:", data_current);

    var data_pre = 0;

    var lastday = getLastDate(1);
    for (var i = 0, flag = 0; (i < results_database.length) && (flag == 0); i++) {
      if (results_database[i]["date"] == lastday) {
        data_pre = results_database[i]["total_Forum_Posts"];
        flag = 1;
      }
    }

    geckoboard.geckoPush(data_current, data_pre, "Total Forum Posts");
    console.log('Complete Total Forum Posts Push.');

    updateDatabase("total_Forum_Posts", data_current, today, function() {
      Project.find({},function(err, res){
        if (err) throw err;
        console.log("Total Forum Post in database is updated:\n", res);
      });
    });
  });
};

var jobNumberAlphaDownload = function() {
  var today = getDateToday();
  console.log("Today is", today);

  queryDatabase(function(err, res){
    results_database = [];
    results_database = res;

    if (results_database.length == 0) {
      console.log("Nothing in database now.");
    }
    else {
      console.log("Query:", res[0]["date"]);
    }
    console.log("Database Query completes.");
  });

  param_cc = param.viewFilterParams_CEM_Nautilus_Alpha1_Download_x64;
  console.log('Start Total Alpha1 Downloads Query.');

  centercode.getData(url_live_site, param_cc, function(data){
    var download_counts = 0;
    for (var i = 0; i < data.length; i++) {
      if (data[i]['AutoCAD Nautilus Alpha 1 - 64bit  (1 of 2)'] == 2) {
        download_counts++;
      }
    }
    console.log("Download Numbers:", download_counts);

    var data_current = download_counts;
    var data_pre = 0;

    var lastday = getLastDate(1);
    for (var i = 0, flag = 0; (i < results_database.length) && (flag == 0); i++) {
      if (results_database[i]["date"] == lastday) {
        data_pre = results_database[i]["total_download_Alpha1"];
        flag = 1;
      }
    }

    geckoboard.geckoPush(data_current, data_pre, "Alpha1 64bit Download");
    console.log('Complete Total Forum Posts Push.');

    updateDatabase("total_download_Alpha1", data_current, today, function() {
      Project.find({},function(err, res){
        if (err) throw err;
        console.log("Total Alpha Download in database is updated:\n", res);
      });
    });
  });
};

var jobLineChartProjectLogin = function() {
  var today = getDateToday();

  queryDatabase(function(err, res){
    results_database = [];
    results_database = res;

    if (results_database.length == 0) {
      console.log("Nothing in database now.");
    }
    else {
      console.log("Query:", res[0]["date"]);
    }
    console.log("Database Query completes.");
  });

  param_cc = param.viewFilterParams_CEM_Project_Login;
  console.log('Start CenterCode Total Project Login Query.');

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

    var date_pre;
    Project.count({}, function(err, count) {
      if (err) throw err;

      for (var i = 0, j = 1; i < count; i++) {
        console.log("condition:", i, results_database[i]["date"]);
        if (results_database[i]["date"] != null) {
          date_pre = results_database[i]["date"];
          //Example: data_current[1] = ["2015-07-17", 2000];
          data_current[j] = [];
          data_current[j][0] = date_pre;
          if (results_database[i]["total_Project_Login"] == null) {
            data_current[j][1] = 0;
          }
          else {
            data_current[j][1] = parseInt(results_database[i]["total_Project_Login"]);
          }
          j++;
        }
      }

      console.log("Current Data:", data_current);

      data_pre = null;
      geckoboard.geckoPush(data_current, data_pre, "Total Project Login");
    });

    console.log('Complete Total Forum Posts Push.');

    updateDatabase("total_Project_Login", login_counts, today, function() {
      Project.find({}, function(err, res){
        if (err) throw err;
        //console.log("database result:", res);
      });
    });
  });
};

var runRightNow = function() {
  // Add the code to run right now
  jobNumberForumPost();

  setTimeout(function () {
    jobNumberAlphaDownload();
  },
  10000 // milliseconds
  );

  setTimeout(function () {
    jobLineChartProjectLogin();
  },
  20000 // milliseconds
  );

};

runRightNow();

// Job schedule
var job_Daily_Schedule = new CronJob('00 00 12 * * 0-6', function(){
  // Run everyday at 12:00:00 AM
  runRightNow();
},
null,
true, // Start the job right now
"America/Los_Angeles");

// Run in series
/*
async.parallel([
  function(callback) {
    console.log("Start jobLineChartProjectLogin");
    jobLineChartProjectLogin();
    callback();
  },
  function(callback) {
    console.log("Start jobNumberAlphaDownload");
    //jobNumberAlphaDownload();
    callback();
  }
]);*/


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
