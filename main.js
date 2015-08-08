var CronJob = require('cron').CronJob;

var CenterCode = require('./centercode');
var centercode = new CenterCode();

var param = require('./param.js');

//var Geckoboard = require('./geckoboard');
//var geckoboard = new Geckoboard();

var url_preview_site = 'http://preview.beta.autodesk.com/cai/005/User.asmx?WSDL';
var url_live_site = 'http://beta.autodesk.com/cai/005/User.asmx?WSDL';

var param_cc = param.viewFilterParams_CEM_Total_User_Form_Posts;

var job = new CronJob('00 * * * * 0-6', function(){
  // Run everyday at 12:00:00 AM
  console.log('You will see this message.');
  //centercode.getData(url_preview_site, param.viewFilterParams_test);
  centercode.getData(url_live_site, param_cc, function(data){
    console.log("data:", data.pop());

    //geckoboard.geckoPush();

  });
  // Pull data from CenterCode website
},
null,
true, // Start the job right now
"America/Los_Angeles");
