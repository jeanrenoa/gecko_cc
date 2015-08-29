var CronJob = require('cron').CronJob;

var CenterCode = require('./centercode');
var centercode = new CenterCode();

var param = require('./param');

var Geckoboard = require('./geckoboard');
var geckoboard = new Geckoboard();

//var async = require('async');

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
  total_download_Maestro_SP1_Beta1_x64: Number,
  total_download_Maestro_SP1_Beta1_x86: Number,
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
        case "total_download_Maestro_SP1_Beta1_x64":
          proj_database.total_download_Maestro_SP1_Beta1_x64 = data;
          break;
        case "total_download_Maestro_SP1_Beta1_x86":
          proj_database.total_download_Maestro_SP1_Beta1_x86 = data;
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
        case "total_download_Maestro_SP1_Beta1_x64":
          res.total_download_Maestro_SP1_Beta1_x64 = data;
          break;
        case "total_download_Maestro_SP1_Beta1_x86":
          res.total_download_Maestro_SP1_Beta1_x86 = data;
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
    //console.log("Database results:", res, typeof res);
    callback(err, res);
  });
};

var getDateToday = function() {
  var now = new Date();
  var year = now.getFullYear();
  var month = now.getMonth() + 1;
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
  var month = now.getMonth() + 1;
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

Date.prototype.getWeek = function(start) {
    //Calcing the starting point
    start = start || 0;
    var today = new Date(this.setHours(0, 0, 0, 0));
    var day = today.getDay() - start;
    var date = today.getDate() - day;

    // Grabbing Start/End Dates
    var StartDate = new Date(today.setDate(date));
    var EndDate = new Date(today.setDate(date + 6));
    return [StartDate, EndDate];
}
//test code
//var Dates = new Date("2015-8-31").getWeek();
//console.log(Dates[0].toLocaleDateString() + ' to '+ Dates[1].toLocaleDateString());

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
      console.log("The earliest document on:", res[0]["date"]);
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
        console.log("Total Forum Post in database is updated.");
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
      console.log("The earliest document on:", res[0]["date"]);
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
        console.log("Total Alpha Download in database is updated.");
      });
    });
  });
};

var jobNumberMaestroSP1Beta1x64Download = function() {
  var today = getDateToday();
  console.log("Today is", today);

  queryDatabase(function(err, res){
    results_database = [];
    results_database = res;

    if (results_database.length == 0) {
      console.log("Nothing in database now.");
    }
    else {
      console.log("The earliest document on:", res[0]["date"]);
    }
    console.log("Database Query completes.");
  });

  param_cc = param.viewFilterParams_CEM_Maestro_SP1_Beta1_Download_x64;
  console.log('Start Total Maestro SP1 Beta1 64bit Downloads Query.');

  centercode.getData(url_live_site, param_cc, function(data){
    var download_counts = 0;
    for (var i = 0; i < data.length; i++) {
      if (data[i]['AutoCAD 2016 SP1 Beta 1 - 64bit'] == 2) {
        download_counts++;
      }
    }
    console.log("Download Numbers:", download_counts);

    var data_current = download_counts;
    var data_pre = 0;

    var lastday = getLastDate(1);
    for (var i = 0, flag = 0; (i < results_database.length) && (flag == 0); i++) {
      if (results_database[i]["date"] == lastday && results_database[i]["total_download_Maestro_SP1_Beta1_x64"] != undefined) {
        data_pre = results_database[i]["total_download_Maestro_SP1_Beta1_x64"];
        flag = 1;
      }
    }

    geckoboard.geckoPush(data_current, data_pre, "Maestro SP1 Beta1 64bit Download");
    console.log('Complete Maestro SP1 Beta1 64bit Download Push.');

    updateDatabase("total_download_Maestro_SP1_Beta1_x64", data_current, today, function() {
      Project.find({},function(err, res){
        if (err) throw err;
        console.log("Total Maestro SP1 Beta1 64bit Download in database is updated.");
      });
    });
  });
};

var jobNumberMaestroSP1Beta1x86Download = function() {
  var today = getDateToday();
  console.log("Today is", today);

  queryDatabase(function(err, res){
    results_database = [];
    results_database = res;

    if (results_database.length == 0) {
      console.log("Nothing in database now.");
    }
    else {
      console.log("The earliest document on:", res[0]["date"]);
    }
    console.log("Database Query completes.");
  });

  param_cc = param.viewFilterParams_CEM_Maestro_SP1_Beta1_Download_x86;
  console.log('Start Total Maestro SP1 Beta1 32bit Downloads Query.');

  centercode.getData(url_live_site, param_cc, function(data){
    var download_counts = 0;
    for (var i = 0; i < data.length; i++) {
      if (data[i]['AutoCAD 2016 SP1 Beta 1 - 32bit'] == 2) {
        download_counts++;
      }
    }
    console.log("Download Numbers:", download_counts);

    var data_current = download_counts;
    var data_pre = 0;

    var lastday = getLastDate(1);
    for (var i = 0, flag = 0; (i < results_database.length) && (flag == 0); i++) {
      if (results_database[i]["date"] == lastday && results_database[i]["total_download_Maestro_SP1_Beta1_x86"] != undefined) {
        data_pre = results_database[i]["total_download_Maestro_SP1_Beta1_x86"];
        flag = 1;
      }
    }

    geckoboard.geckoPush(data_current, data_pre, "Maestro SP1 Beta1 32bit Download");
    console.log('Complete Maestro SP1 Beta1 Download Push.');

    updateDatabase("total_download_Maestro_SP1_Beta1_x86", data_current, today, function() {
      Project.find({},function(err, res){
        if (err) throw err;
        console.log("Total Maestro SP1 Beta1 32bit Download in database is updated.");
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
      console.log("The earliest document on:", res[0]["date"]);
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
          if (results_database[i]["total_Project_Login"] != null) {
            data_current[j] = [];
            data_current[j][0] = date_pre;
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
        console.log("Total Projects Login counts in database is updated.");
      });
    });
  });
};

var jobBarChartWeeklyAlphaDownload = function() {
  var today = getDateToday();
  console.log("Today is", today);

  queryDatabase(function(err, res){
    results_database = [];
    results_database = res;

    if (results_database.length == 0) {
      console.log("Nothing in database now.");
    }
    else {
      console.log("The earliest document on:", res[0]["date"]);
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
    console.log("Nautilus Alpha1 64bit Downloads:", download_counts);

    var data_current = [];
    var data_pre = null;
    var data_weekly = [];

    var Dates = new Date(today).getWeek();
    console.log("Today is in the week:", Dates[0].toLocaleDateString() + ' to '+ Dates[1].toLocaleDateString());
    console.log("The start date of this week:", getFormattedDate(Dates[0]));

    var filterResult = results_database.filter(function(item, index, array) {
      return (item["date"] == getFormattedDate(Dates[0]));
    });
    //console.log("Filter Result:", filterResult[0]["total_download_Alpha1"]);

    var weekly_num = [];
    var weekly_date = [];
    // Store data this week: sub btween current date and the start date
    if (filterResult.length != 0) {
      weekly_num.push(parseInt(download_counts) - parseInt(filterResult[0]["total_download_Alpha1"]));
      weekly_date.push(getFormattedDate(Dates[0]));
    }

    var filterResult1, filterResult2;
    var currentDate = today;
    do {
      var LastDates = new Date(currentDate).getWeek(-7);
      console.log("The previous week:", LastDates[0].toLocaleDateString() + ' to '+ LastDates[1].toLocaleDateString());

      filterResult1 = results_database.filter(function(item, index, array) {
        return (item["date"] == getFormattedDate(LastDates[0]));
      });
      console.log("Filter Result1:", filterResult1, filterResult1.length);

      filterResult2 = results_database.filter(function(item, index, array) {
        return (item["date"] == getFormattedDate(LastDates[1]));
      });

      if (filterResult1.length != 0 && filterResult2.length != 0) {
        weekly_num.push(parseInt(filterResult2[0]["total_download_Alpha1"]) - parseInt(filterResult1[0]["total_download_Alpha1"]));
        weekly_date.push(getFormattedDate(LastDates[0]));
      }

      currentDate = getFormattedDate(LastDates[1]); // Set current date to the ending date of last week
    } while (filterResult1.length != 0);

    data_current[0] = weekly_date;
    data_current[1] = weekly_num;
    if (weekly_date.length != 0) {
      geckoboard.geckoPush(data_current, data_pre, "Weekly Alpha1 Download");
    }
    console.log('Complete Weekly Alpha1 Download Push.');
  });
};

var runRightNow = function() {
  // Add the code to run right now
  //jobNumberForumPost();
  //jobBarChartWeeklyAlphaDownload();
  //jobNumberMaestroSP1Beta1x64Download();
  jobNumberMaestroSP1Beta1x86Download();

/*
  setTimeout(function () {
    jobNumberForumPost();
  },
  20000 // milliseconds
  );

  setTimeout(function () {
    jobNumberAlphaDownload();
  },
  40000 // milliseconds
  );

  setTimeout(function () {
    jobLineChartProjectLogin();
  },
  60000 // milliseconds
  );

  setTimeout(function () {
    jobBarChartWeeklyAlphaDownload();
  },
  80000 // milliseconds
  );

  setTimeout(function () {
    jobNumberMaestroSP1Beta1x64Download();
  },
  100000 // milliseconds
  );

  setTimeout(function () {
    jobNumberMaestroSP1Beta1x86Download();
  },
  120000 // milliseconds
  );
*/
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
