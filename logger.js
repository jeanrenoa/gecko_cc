var logger = exports;
logger.debugLevel = 'debug';

logger.log = function(level, message) {
  var levels = ['warn', 'info', 'debug', 'release'];
  if (levels.indexOf(level) >= levels.indexOf(logger.debugLevel) ) {
    //if (typeof message !== 'string') {
    //  message = JSON.stringify(message);
    //};
    console.log(message);
  }
}
