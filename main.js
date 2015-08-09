var CronJob = require('cron').CronJob;

var CenterCode = require('./centercode');
var centercode = new CenterCode();

var param = require('./param.js');

var Geckoboard = require('./geckoboard');
var geckoboard = new Geckoboard();

var url_preview_site = 'http://preview.beta.autodesk.com/cai/005/User.asmx?WSDL';
var url_live_site = 'http://beta.autodesk.com/cai/005/User.asmx?WSDL';

var param_cc;

var job_Total_Forum_Posts = new CronJob('00 * * * * 0-6', function(){
  // Run everyday at 12:00:00 AM
  param_cc = param.viewFilterParams_CEM_Total_User_Form_Posts;
  console.log('Start Total Forum Posts Query.');
  centercode.getData(url_live_site, param_cc, function(data){
    //console.log("data:", data[1]['# of Total User Forum Posts']);

    geckoboard.geckoPush(data, "Total Forum Posts");

  });
  console.log('Complete Total Forum Posts Push.');
  // Pull data from CenterCode website
},
null,
true, // Start the job right now
"America/Los_Angeles");

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
