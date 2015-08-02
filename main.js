//var CronJob = require('cron').CronJob;

//var CenterCode = require('./centercode');
//var centercode = new CenterCode();

var Geckoboard = require('./geckoboard');
var geckoboard = new Geckoboard();

geckoboard.geckoPush();

/* var data;

var job = new CronJob('00 * * * * 0-6', function(){
  // Run everyday at 12:00:00 AM
  console.log('You will see this message.');
  centercode.getData(data);
  console.log(data);
  // Pull data from CenterCode website
},
null,
true, // Start the job right now
"America/Los_Angeles");
*/
