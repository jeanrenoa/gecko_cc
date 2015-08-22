var async = require('async');

async.series([
  function(callback) {
    console.log("1");
    callback();
  },
  function(callback) {
    console.log("1.5");
    setTimeout(function() {
      console.log('.....');
      console.log("2");
    }, 3000);
    callback();
  }
]);
