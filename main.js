var CronJob = require('cron').CronJob;

var CenterCode = require('./centercode');
var centercode = new CenterCode();

var param = require('./param');

var Geckoboard = require('./geckoboard');
var geckoboard = new Geckoboard();

var logger = require('./logger');
logger.debugLevel = 'debug';

var whoami = "whoami";

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
  total_Forum_Posts_By_Internal_Tester: Number,
  total_download_Alpha1: Number,
  total_Project_Login: Number,
  total_download_Maestro_SP1_Beta1_x64: Number,
  total_download_Maestro_SP1_Beta1_x86: Number,
  total_download_Maestro_SP1_Beta2_x64: Number,
  total_download_Maestro_SP1_Beta2_x86: Number,
  total_Forum_Posts_Maestro_SP1_Beta1: Number,
  total_download_Nautilus_Alpha2_x64: Number,
  total_download_Nautilus_Alpha2_x86: Number,
  total_download_Nautilus_Beta1_x64: Number,
  total_download_Nautilus_Beta1_x86: Number,
  total_download_Nautilus_Beta2_x64: Number,
  total_download_Nautilus_Beta2_x86: Number,
  date: String,
  baseline: Boolean,
  Week: Number
});

var field_CenterCode = {
  "Total Forum Posts": "# of Total User Forum Posts",
  "Alpha1 64bit Download": "AutoCAD Nautilus Alpha 1 - 64bit  (1 of 2)",
  "Maestro SP1 Beta2 32bit Download": "AutoCAD 2016 SP1 Beta 2 - 32bit",
  "Maestro SP1 Beta2 64bit Download": "AutoCAD 2016 SP1 Beta 2 - 64bit"
};

var Project = mongodb.mongoose.model('Project', projectSchema);
var results_database; // result from queryDatabase

function updateDatabase (key, data, date, callback) {

  logger.log('info', 'Start to update database.')

  Project.findOne({date: date}, function(err, res){
    if (err) throw err;

    var array = [];
    array = res;
    logger.log('debug', 'Database Query: ' + array);

    if (array == null) {
      // No record by condition, directly save the current data
      var proj_database = new Project({
        project: 'AutoCAD Customer Council'
      });
      proj_database.date = date;

      proj_database[key] = data;

      proj_database.save(function(err){
        if (err) throw err;
        logger.log('debug', 'Database successfully saved.');
      });
    }
    else {
      // Find the data by condition, need to update database
      res[key] = data;

      res.save(function(err) {
        if (err) throw err;
        logger.log('debug', 'Database updated accordingly.');
      });
    }
  });

  callback();
}

function queryDatabase () {
  results_database = [];
  Project.find({}, function(err, res){
    if (err) throw err;

    results_database = res;
    if (results_database.length == 0) {
      logger.log('debug', 'Nothing in database now.');
    }
    else {
      logger.log('debug', 'The earliest document on: ' + res[0]["date"]);
    }
    logger.log('debug', 'Database Query completes.');
  });
}

function getDateToday () {
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
}

function getLastDate (n) {
  var day = new Date();
  day.setDate(day.getDate() - n);

  var year = day.getFullYear();
  var month = day.getMonth() + 1;
  var date = day.getDate();
  if (month < 10) {
    month = "0" + month;
  }
  if (date < 10) {
    date = "0" + date;
  }
  var Last_N_date = year + "-" + month + "-" + date;
  return Last_N_date;
}

function getFormattedDate (date) {
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
}

Date.prototype.getWeek = function(start) {
    //Calcing the starting point
    start = start || 0;
    var today = new Date(this.setHours(0, 0, 0, 0));
    var day = today.getDay() - start;
    var date = today.getDate() - day;

    // Grabbing Start/End Dates
    var today_backup = new Date(today);
    var StartDate = new Date(today.setDate(date));
    var EndDate = new Date(today_backup.setDate(date + 6));
    return [StartDate, EndDate];
}
//test code
//var Dates = new Date("2015-8-31").getWeek();
//console.log(Dates[0].toLocaleDateString() + ' to '+ Dates[1].toLocaleDateString());

function getDataCurrent(key, data) {
  var res;
  switch (key) {
    case 'Total Forum Posts':
      res = data[1][field_CenterCode[key]];
      break;
    case 'Alpha1 64bit Download':
    case 'Maestro SP1 Beta2 32bit Download':
    case 'Maestro SP1 Beta2 64bit Download':
      var download_counts = 0;
      for (var i = 0; i < data.length; i++) {
        if (data[i][field_CenterCode[key]] == 2) {
          download_counts++;
        }
      }
      res = download_counts;
      break;
    default:

  }
  return res;
}

function getDataLastDay(key_db) {
  var lastday = getLastDate(1);
  var res;
  for (var i = 0, flag = 0; (i < results_database.length) && (flag == 0); i++) {
    if (results_database[i]["date"] == lastday) {
      res = results_database[i][key_db];
      flag = 1;
    }
  }
  return res;
}

function processDBData(key, chartType, key_db, data) {
  var data_current;
  var data_pre;

  data_current = getDataCurrent(key, data);
  data_pre = getDataLastDay(key_db);

  logger.log('release', key + ': ' + data_current);

  return {current:data_current, previous:data_pre};
}

function jobHandler(key, chartType) {
  var today = getDateToday();

  queryDatabase();  // Store the result queried from database into results_database

  var key_db;  // the corresponding property in DB to the key

  switch (key) {
    case 'Total Forum Posts':
      param_cc = param.viewFilterParams_CEM_Total_User_Form_Posts;
      key_db = 'total_Forum_Posts';
      break;
    case 'Alpha1 64bit Download':
      param_cc = param.viewFilterParams_CEM_Nautilus_Alpha1_Download_x64;
      key_db = 'total_download_Alpha1';
      break;
    case 'Maestro SP1 Beta2 32bit Download':
      param_cc = param.viewFilterParams_CEM_Maestro_SP1_Beta2_Download_x86;
      key_db = 'total_download_Maestro_SP1_Beta2_x86';
      break;
    case 'Maestro SP1 Beta2 64bit Download':
      param_cc = param.viewFilterParams_CEM_Maestro_SP1_Beta2_Download_x64;
      key_db = 'total_download_Maestro_SP1_Beta2_x64';
      break;
    default:
      param_cc = '';
  }
  logger.log('release', 'Start ' + key + ' Query from Database.');

  try {
    centercode.getData(url_live_site, param_cc, function(data){
      var result_DB = processDBData(key, chartType, key_db, data);
      logger.log('debug', 'Current: ' + result_DB.current);
      logger.log('debug', 'Previous: ' + result_DB.previous);

      geckoboard.geckoPush(result_DB.current, result_DB.previous, key);
      logger.log('debug', 'Complete ' + key + ' Push to Geckobaord.');

      updateDatabase(key_db, result_DB.current, today, function() {
        Project.find({},function(err, res){
          if (err) throw err;
          logger.log('debug', key + ' in database is updated.');
        });
      });
    });
  } catch (err) {
    console.log("Error:", err);
  }
}

function jobNumberMaestroSP1Beta2x86Download() {
  jobHandler('Maestro SP1 Beta2 32bit Download');
}

function jobNumberMaestroSP1Beta2x64Download() {
  jobHandler('Maestro SP1 Beta2 64bit Download');
}

var jobNumberForumPost = function() {
  var today = getDateToday();

  queryDatabase();  // Store the result queried from database into results_database

  param_cc = param.viewFilterParams_CEM_Total_User_Form_Posts;
  logger.log('release', 'Start Total Forum Posts Query.');

  centercode.getData(url_live_site, param_cc, function(data){
    var data_current = data[1]['# of Total User Forum Posts'];
    logger.log('release', 'Forum Posts: ' + data_current);

    var data_pre = 0;
    var lastday = getLastDate(1);
    for (var i = 0, flag = 0; (i < results_database.length) && (flag == 0); i++) {
      if (results_database[i]["date"] == lastday) {
        data_pre = results_database[i]["total_Forum_Posts"];
        flag = 1;
      }
    }

    geckoboard.geckoPush(data_current, data_pre, "Total Forum Posts");
    logger.log('debug', 'Complete Total Forum Posts Push.');

    updateDatabase("total_Forum_Posts", data_current, today, function() {
      Project.find({},function(err, res){
        if (err) throw err;
        logger.log('debug', 'Total Forum Post in database is updated.');
      });
    });
  });
};

var jobNumberAlphaDownload = function() {
  var today = getDateToday();

  queryDatabase();  // Store the result queried from database into results_database

  param_cc = param.viewFilterParams_CEM_Nautilus_Alpha1_Download_x64;
  logger.log('release', 'Start Total Alpha1 Downloads Query.');

  centercode.getData(url_live_site, param_cc, function(data){
    var download_counts = 0;
    for (var i = 0; i < data.length; i++) {
      if (data[i]['AutoCAD Nautilus Alpha 1 - 64bit  (1 of 2)'] == 2) {
        download_counts++;
      }
    }
    logger.log('release', 'Download Numbers: ' + download_counts);

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
    logger.log('debug', 'Complete Total Forum Posts Push.');

    updateDatabase("total_download_Alpha1", data_current, today, function() {
      Project.find({},function(err, res){
        if (err) throw err;
        logger.log('debug', 'Total Alpha Download in database is updated.');
      });
    });
  });
};

var jobNumberMaestroSP1Beta1x64Download = function() {
  var today = getDateToday();

  queryDatabase();  // Store the result queried from database into results_database

  param_cc = param.viewFilterParams_CEM_Maestro_SP1_Beta1_Download_x64;
  logger.log('release', 'Start Total Maestro SP1 Beta1 64bit Downloads Query.');

  centercode.getData(url_live_site, param_cc, function(data){
    var download_counts = 0;
    for (var i = 0; i < data.length; i++) {
      if (data[i]['AutoCAD 2016 SP1 Beta 1 - 64bit'] == 2) {
        download_counts++;
      }
    }
    logger.log('release', 'Download Numbers: ' + download_counts);

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
    logger.log('debug', 'Complete Maestro SP1 Beta1 64bit Download Push.');

    updateDatabase("total_download_Maestro_SP1_Beta1_x64", data_current, today, function() {
      Project.find({},function(err, res){
        if (err) throw err;
        logger.log('debug', 'Total Maestro SP1 Beta1 64bit Download in database is updated.');
      });
    });
  });
};

var jobNumberMaestroSP1Beta1x86Download = function() {
  var today = getDateToday();

  queryDatabase();  // Store the result queried from database into results_database

  param_cc = param.viewFilterParams_CEM_Maestro_SP1_Beta1_Download_x86;
  logger.log('release', 'Start Total Maestro SP1 Beta1 32bit Downloads Query.');

  centercode.getData(url_live_site, param_cc, function(data){
    var download_counts = 0;
    for (var i = 0; i < data.length; i++) {
      if (data[i]['AutoCAD 2016 SP1 Beta 1 - 32bit'] == 2) {
        download_counts++;
      }
    }
    logger.log('release', 'Download Numbers: ' + download_counts);

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
    logger.log('debug', 'Complete Maestro SP1 Beta1 Download Push.');

    updateDatabase("total_download_Maestro_SP1_Beta1_x86", data_current, today, function() {
      Project.find({},function(err, res){
        if (err) throw err;
        logger.log('debug', 'Total Maestro SP1 Beta1 32bit Download in database is updated.');
      });
    });
  });
};

var jobNumberMaestroSP1Beta1ForumPosts = function() {
  var today = getDateToday();

  queryDatabase();  // Store the result queried from database into results_database

  param_cc = param.viewFilterParams_CEM_Maestro_SP1_Beta1_Forum_Posts;
  logger.log('release', 'Start Total Maestro SP1 Beta1 Forum Posts Query.');

  centercode.getData(url_live_site, param_cc, function(data){
    var posts_counts = 0;
    for (var i = 0; i < data.length; i++) {
      if (data[i].Posts != undefined) {
        posts_counts = posts_counts + parseInt(data[i].Posts);
      }
    }

    logger.log('release', "Forum Posts Numbers: "+posts_counts);

    var data_current = posts_counts;
    var data_pre = 0;

    var lastday = getLastDate(1);
    for (var i = 0, flag = 0; (i < results_database.length) && (flag == 0); i++) {
      if (results_database[i]["date"] == lastday && results_database[i]["total_Forum_Posts_Maestro_SP1_Beta1"] != undefined) {
        data_pre = results_database[i]["total_Forum_Posts_Maestro_SP1_Beta1"];
        flag = 1;
      }
    }

    geckoboard.geckoPush(data_current, data_pre, "Maestro SP1 Beta1 Forum Posts");
    logger.log('debug', 'Complete Maestro SP1 Beta1 Forum Posts Push.');

    updateDatabase("total_Forum_Posts_Maestro_SP1_Beta1", data_current, today, function() {
      Project.find({},function(err, res){
        if (err) throw err;
        logger.log('debug', 'Total Maestro SP1 Beta1 Fourm Posts in database is updated.');
      });
    });
  });
};

var jobNumberNautilusAlpha2x64Download = function() {
  var today = getDateToday();

  queryDatabase();  // Store the result queried from database into results_database

  param_cc = param.viewFilterParams_CEM_Nautilus_Alpha2_Download_x64;
  logger.log('release', 'Start Total Nautilus Alpha2 64bit Downloads Query.');

  centercode.getData(url_live_site, param_cc, function(data){
    var download_counts = 0;
    for (var i = 0; i < data.length; i++) {
      if (data[i]['AutoCAD Nautilus Alpha 2 - 64bit (1 of 2) '] == 2) {
        download_counts++;
      }
    }
    logger.log('release', 'Download Numbers: ' + download_counts);

    var data_current = download_counts;
    var data_pre = 0;

    var lastday = getLastDate(1);
    for (var i = 0, flag = 0; (i < results_database.length) && (flag == 0); i++) {
      if (results_database[i]["date"] == lastday && results_database[i]["total_download_Nautilus_Alpha2_x64"] != undefined) {
        data_pre = results_database[i]["total_download_Nautilus_Alpha2_x64"];
        flag = 1;
      }
    }

    geckoboard.geckoPush(data_current, data_pre, "Nautilus Alpha2 64bit Download");
    logger.log('debug', 'Complete Nautilus 64bit Download Push.');

    updateDatabase("total_download_Nautilus_Alpha2_x64", data_current, today, function() {
      Project.find({},function(err, res){
        if (err) throw err;
        logger.log('debug', 'Nautilus Alpha2 64bit Download in database is updated.');
      });
    });
  });
};

var jobNumberNautilusAlpha2x86Download = function() {
  var today = getDateToday();

  queryDatabase();  // Store the result queried from database into results_database

  param_cc = param.viewFilterParams_CEM_Nautilus_Alpha2_Download_x86;
  logger.log('release', 'Start Total Nautilus Alpha2 32bit Downloads Query.');

  centercode.getData(url_live_site, param_cc, function(data){
    var download_counts = 0;
    for (var i = 0; i < data.length; i++) {
      if (data[i]['AutoCAD Nautilus Alpha 2 - 32bit '] == 2) {
        download_counts++;
      }
    }
    logger.log('release', 'Download Numbers: ' + download_counts);

    var data_current = download_counts;
    var data_pre = 0;

    var lastday = getLastDate(1);
    for (var i = 0, flag = 0; (i < results_database.length) && (flag == 0); i++) {
      if (results_database[i]["date"] == lastday && results_database[i]["total_download_Maestro_SP1_Beta1_x86"] != undefined) {
        data_pre = results_database[i]["total_download_Nautilus_Alpha2_x86"];
        flag = 1;
      }
    }

    geckoboard.geckoPush(data_current, data_pre, "Nautilus Alpha2 32bit Download");
    logger.log('debug', 'Complete Nautilus Alpha2 32bit Download Push.');

    updateDatabase("total_download_Nautilus_Alpha2_x86", data_current, today, function() {
      Project.find({},function(err, res){
        if (err) throw err;
        logger.log('debug', 'Total Nautilus Alpha2 32bit Download in database is updated.');
      });
    });
  });
};

var jobNumberNautilusBeta1x64Download = function() {
  var today = getDateToday();

  queryDatabase();  // Store the result queried from database into results_database

  param_cc = param.viewFilterParams_CEM_Nautilus_Beta1_Download_x64;
  logger.log('release', 'Start Total Nautilus Beta1 64bit Downloads Query.');

  centercode.getData(url_live_site, param_cc, function(data){
    var download_counts = 0;
    for (var i = 0; i < data.length; i++) {
      if (data[i]['AutoCAD Nautilus Beta 1 - 64bit (1 of 2)'] == 2) {
        download_counts++;
      }
    }
    logger.log('release', 'Download Numbers: ' + download_counts);

    var data_current = download_counts;
    var data_pre = 0;

    var lastday = getLastDate(1);
    for (var i = 0, flag = 0; (i < results_database.length) && (flag == 0); i++) {
      if (results_database[i]["date"] == lastday && results_database[i]["total_download_Nautilus_Beta1_x64"] != undefined) {
        data_pre = results_database[i]["total_download_Nautilus_Beta1_x64"];
        flag = 1;
      }
    }

    geckoboard.geckoPush(data_current, data_pre, "Nautilus Beta1 64bit Download");
    logger.log('debug', 'Complete Nautilus Beta1 64bit Download Push.');

    updateDatabase("total_download_Nautilus_Beta1_x64", data_current, today, function() {
      Project.find({},function(err, res){
        if (err) throw err;
        logger.log('debug', 'Nautilus Beta1 64bit Download in database is updated.');
      });
    });
  });
};

var jobNumberNautilusBeta1x86Download = function() {
  var today = getDateToday();

  queryDatabase();  // Store the result queried from database into results_database

  param_cc = param.viewFilterParams_CEM_Nautilus_Beta1_Download_x86;
  logger.log('release', 'Start Total Nautilus Beta1 32bit Downloads Query.');

  centercode.getData(url_live_site, param_cc, function(data){
    var download_counts = 0;
    for (var i = 0; i < data.length; i++) {
      if (data[i]['AutoCAD Nautilus Beta 1 - 32bit '] == 2) {
        download_counts++;
      }
    }
    logger.log('release', 'Download Numbers: ' + download_counts);

    var data_current = download_counts;
    var data_pre = 0;

    var lastday = getLastDate(1);
    for (var i = 0, flag = 0; (i < results_database.length) && (flag == 0); i++) {
      if (results_database[i]["date"] == lastday && results_database[i]["total_download_Nautilus_Beta1_x86"] != undefined) {
        data_pre = results_database[i]["total_download_Nautilus_Beta1_x86"];
        flag = 1;
      }
    }

    geckoboard.geckoPush(data_current, data_pre, "Nautilus Beta1 32bit Download");
    logger.log('debug', 'Complete Nautilus Beta1 32bit Download Push.');

    updateDatabase("total_download_Nautilus_Beta1_x86", data_current, today, function() {
      Project.find({},function(err, res){
        if (err) throw err;
        logger.log('debug', 'Nautilus Beta1 32bit Download in database is updated.');
      });
    });
  });
};

var jobNumberNautilusBeta2x64Download = function() {
  var today = getDateToday();

  queryDatabase();  // Store the result queried from database into results_database

  param_cc = param.viewFilterParams_CEM_Nautilus_Beta2_Download_x64;
  logger.log('release', 'Start Total Nautilus Beta2 64bit Downloads Query.');

  centercode.getData(url_live_site, param_cc, function(data){
    var download_counts = 0;
    for (var i = 0; i < data.length; i++) {
      if (data[i]['AutoCAD Nautilus Beta 2 - 64bit (1 of 2) '] == 2) {
        download_counts++;
      }
    }
    logger.log('release', 'Download Numbers: ' + download_counts);

    var data_current = download_counts;
    var data_pre = 0;

    var lastday = getLastDate(1);
    for (var i = 0, flag = 0; (i < results_database.length) && (flag == 0); i++) {
      if (results_database[i]["date"] == lastday && results_database[i]["total_download_Nautilus_Beta2_x64"] != undefined) {
        data_pre = results_database[i]["total_download_Nautilus_Beta2_x64"];
        flag = 1;
      }
    }

    geckoboard.geckoPush(data_current, data_pre, "Nautilus Beta2 64bit Download");
    logger.log('debug', 'Complete Nautilus Beta2 64bit Download Push.');

    updateDatabase("total_download_Nautilus_Beta2_x64", data_current, today, function() {
      Project.find({},function(err, res){
        if (err) throw err;
        logger.log('debug', 'Nautilus Beta2 64bit Download in database is updated.');
      });
    });
  });
};

var jobNumberNautilusBeta2x86Download = function() {
  var today = getDateToday();

  queryDatabase();  // Store the result queried from database into results_database

  param_cc = param.viewFilterParams_CEM_Nautilus_Beta2_Download_x86;
  logger.log('release', 'Start Total Nautilus Beta2 32bit Downloads Query.');

  centercode.getData(url_live_site, param_cc, function(data){
    var download_counts = 0;
    for (var i = 0; i < data.length; i++) {
      if (data[i]['AutoCAD Nautilus Beta 2 - 32bit'] == 2) {
        download_counts++;
      }
    }
    logger.log('release', 'Download Numbers: ' + download_counts);

    var data_current = download_counts;
    var data_pre = 0;

    var lastday = getLastDate(1);
    for (var i = 0, flag = 0; (i < results_database.length) && (flag == 0); i++) {
      if (results_database[i]["date"] == lastday && results_database[i]["total_download_Nautilus_Beta2_x86"] != undefined) {
        data_pre = results_database[i]["total_download_Nautilus_Beta2_x86"];
        flag = 1;
      }
    }

    geckoboard.geckoPush(data_current, data_pre, "Nautilus Beta2 32bit Download");
    logger.log('debug', 'Complete Nautilus Beta2 32bit Download Push.');

    updateDatabase("total_download_Nautilus_Beta2_x86", data_current, today, function() {
      Project.find({},function(err, res){
        if (err) throw err;
        logger.log('debug', 'Nautilus Beta2 32bit Download in database is updated.');
      });
    });
  });
};

var jobNumberForumPostByInternalTester = function() {
  var today = getDateToday();

  queryDatabase();  // Store the result queried from database into results_database

  param_cc = param.viewFilterParams_CEM_Forum_Posts_From_Internal_Testers;
  logger.log('release', 'Start Total Internal Tester Forum Post Query.');

  centercode.getData(url_live_site, param_cc, function(data){
    var post_counts = 0;
    for (var i = 0; i < data.length; i++) {
      if (data[i]['# of Forum Posts'] != undefined && data[i]['# of Forum Posts'] != 0) {
        post_counts = post_counts + parseInt(data[i]['# of Forum Posts']);
      }
    }
    logger.log('release', 'Forum Posts from Internal Testers: ' + post_counts);

    var data_current = post_counts;
    var data_pre = 0;

    var lastday = getLastDate(1);
    for (var i = 0, flag = 0; (i < results_database.length) && (flag == 0); i++) {
      if (results_database[i]["date"] == lastday && results_database[i]["total_Forum_Posts_By_Internal_Tester"] != undefined) {
        data_pre = results_database[i]["total_Forum_Posts_By_Internal_Tester"];
        flag = 1;
      }
    }

    geckoboard.geckoPush(data_current, data_pre, "Forum Post By Internal Tester");
    logger.log('debug', 'Complete Forum Post By Tester Push.');

    updateDatabase("total_Forum_Posts_By_Internal_Tester", data_current, today, function() {
      Project.find({},function(err, res){
        if (err) throw err;
        logger.log('debug', 'Forum Post By Internal Tester in database is updated.');
      });
    });
  });
};

var jobLineChartProjectLogin = function() {
  var today = getDateToday();

  queryDatabase();  // Store the result queried from database into results_database

  param_cc = param.viewFilterParams_CEM_Project_Login;
  logger.log('release', 'Start CenterCode Total Project Login Query.');

  centercode.getData(url_live_site, param_cc, function(data){
    var login_counts = 0;
    for (var i = 0; i < data.length; i++) {
      if (data[i]['# of Project Logins'] != null) {
        login_counts = login_counts + parseInt(data[i]['# of Project Logins']);
      }
    }
    logger.log('release', 'Login Numbers: ' + login_counts);

    var data_current = [];
    data_current[0] = [today, login_counts];

    var date_pre;
    Project.count({}, function(err, count) {
      if (err) throw err;

      for (var i = 0, j = 1; i < count; i++) {
        //console.log("condition:", i, results_database[i]["date"], results_database[i]["total_Project_Login"]);
        if (results_database[i]["date"] != undefined && results_database[i]["total_Project_Login"] != undefined) {
          date_pre = results_database[i]["date"];
          //Example: data_current[1] = ["2015-07-17", 2000];
          data_current[j] = [];
          data_current[j][0] = date_pre;
          data_current[j][1] = parseInt(results_database[i]["total_Project_Login"]);

          j++;
        }
      }

      logger.log('debug', 'Current Data: ' + data_current);

      data_pre = null;
      geckoboard.geckoPush(data_current, data_pre, "Total Project Login");
    });

    logger.log('debug', 'Complete Total Project Login Push.');

    updateDatabase("total_Project_Login", login_counts, today, function() {
      Project.find({}, function(err, res){
        if (err) throw err;
        logger.log('debug', 'Total Project Login counts in database is updated.');
      });
    });
  });
};

var jobBarChartWeeklyAlphaDownload = function() {
  var today = getDateToday();

  queryDatabase();  // Store the result queried from database into results_database

  param_cc = param.viewFilterParams_CEM_Nautilus_Alpha1_Download_x64;
  logger.log('release', 'Start Total Alpha1 Downloads Query.');

  centercode.getData(url_live_site, param_cc, function(data){
    var download_counts = 0;
    for (var i = 0; i < data.length; i++) {
      if (data[i]['AutoCAD Nautilus Alpha 1 - 64bit  (1 of 2)'] == 2) {
        download_counts++;
      }
    }
    logger.log('release', "Nautilus Alpha1 64bit Downloads: "+download_counts);

    var data_current = [];
    var data_pre = null;
    var data_weekly = [];

    var Dates = new Date(today).getWeek();
    logger.log('debug', 'Today is in the week: ' + Dates[0].toLocaleDateString() + ' to ' + Dates[1].toLocaleDateString());
    logger.log('debug', 'The start date of this week: ' + getFormattedDate(Dates[0]));

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
      console.log('The previous week:', LastDates[0].toLocaleDateString() + ' to ' + LastDates[1].toLocaleDateString());
      logger.log('debug', 'The previous week: ' + LastDates[0].toLocaleDateString() + ' to ' + LastDates[1].toLocaleDateString());

      filterResult1 = results_database.filter(function(item, index, array) {
        return (item["date"] == getFormattedDate(LastDates[0]));
      });

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
    console.log("weekly:", weekly_date);
    if (weekly_date.length != 0) {
      geckoboard.geckoPush(data_current, data_pre, "Weekly Alpha1 Download");
    }
    logger.log('debug', 'Complete Weekly Alpha1 Download Push.');
  });
};

var jobBarChartWeeklyProjectLogin = function() {
  var today = getDateToday();

  queryDatabase();  // Store the result queried from database into results_database

  param_cc = param.viewFilterParams_CEM_Project_Login;
  logger.log('release', 'Start Weekly Project Login Query.');

  centercode.getData(url_live_site, param_cc, function(data){
    var login_counts = 0;
    for (var i = 0; i < data.length; i++) {
      if (data[i]['# of Project Logins'] != null) {
        login_counts = login_counts + parseInt(data[i]['# of Project Logins']);
      }
    }
    logger.log('release', 'Project Login: ' + login_counts);

    var data_current = [];
    var data_pre = null;
    var data_weekly = [];

    var Dates = new Date(today).getWeek();
    logger.log('debug', 'Today is in the week: ' + Dates[0].toLocaleDateString() + ' to ' + Dates[1].toLocaleDateString());
    logger.log('debug', 'The start date of this week: ' + getFormattedDate(Dates[0]));

    var filterResult = results_database.filter(function(item, index, array) {
      return (item["date"] == getFormattedDate(Dates[0]));
    });
    //console.log("Filter Result:", filterResult[0]["total_download_Alpha1"]);

    var weekly_num = [];
    var weekly_date = [];
    // Store data this week: sub btween current date and the start date
    if (filterResult.length != 0) {
      weekly_num.push(parseInt(login_counts) - parseInt(filterResult[0]["total_Project_Login"]));
      weekly_date.push(getFormattedDate(Dates[0]));
    }

    var filterResult1, filterResult2;
    var currentDate = today;

    do {
      console.log('current date:', currentDate);
      var LastDates = new Date(currentDate).getWeek(-7);
      console.log('The previous week:', LastDates[0].toLocaleDateString() + ' to ' + LastDates[1].toLocaleDateString());

      filterResult1 = results_database.filter(function(item, index, array) {
        return (item["date"] == getFormattedDate(LastDates[0]));
      });

      filterResult2 = results_database.filter(function(item, index, array) {
        return (item["date"] == getFormattedDate(LastDates[1]));
      });

      if (filterResult1.length != 0 && filterResult2.length != 0) {
        weekly_num.push(parseInt(filterResult2[0]["total_Project_Login"]) - parseInt(filterResult1[0]["total_Project_Login"]));
        console.log(filterResult2[0]["total_Project_Login"], filterResult1[0]["total_Project_Login"]);
        weekly_date.push(getFormattedDate(LastDates[0]));
      }

      currentDate = getFormattedDate(LastDates[1]); // Set current date to the ending date of last week
    } while (filterResult1.length != 0);

    data_current[0] = weekly_date;
    data_current[1] = weekly_num;
    console.log("weekly:", weekly_date);
    if (weekly_date.length != 0) {
      geckoboard.geckoPush(data_current, data_pre, "Weekly Project Login");
    }
    logger.log('debug', 'Complete Weekly Project Login Push.');
  });
};

function runFunctionByTimeout(callback, timeout) {
  setTimeout(function () {
    callback();
  },
  timeout*60000 // milliseconds
  );
}

var runRightNow = function() {
  var today = getDateToday();
  logger.log('release', 'Today is: ' + today);
  logger.log('release', '*** Job Starts *** ' + new Date());

  // Add the code to run right now
  //jobHandler('Total Forum Posts');
  //jobNumberForumPost();
  //jobNumberForumPostByInternalTester();
  //jobNumberNautilusBeta2x86Download();


  runFunctionByTimeout(jobNumberForumPost, 0);
  runFunctionByTimeout(jobLineChartProjectLogin, 5);
  runFunctionByTimeout(jobNumberNautilusBeta2x64Download, 10);
  runFunctionByTimeout(jobNumberNautilusBeta2x86Download, 15);
  runFunctionByTimeout(jobNumberForumPostByInternalTester, 20);
  runFunctionByTimeout(jobBarChartWeeklyProjectLogin, 25);

};

runRightNow();

// Job schedule

var job_Daily_Schedule = new CronJob('00 00 12 * * 0-6', function(){
  // Run everyday at 12:00:00 AM: '00 00 12 * * 0-6'
  // Run every two hours: '00 00 */2 * * 0-6'
  logger.log('release', '*** Job Starts *** ' + new Date());
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
