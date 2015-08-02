function Geckoboard() {
  var request = require('request');
  var geckoboard_widget_push_url = 'https://push.geckoboard.com/v1/send/152051-6d174582-9333-469d-b853-f0054067e524';
  var geckoboard_api_key = '8c46bf5a67b823e858c8797fc3966871';

  var gecko_text = {
    "item": [
      {
        "text": "production-web-1: NOT RESPONDING",
        "type": 1
      }
    ]
  }

  var payload = {
    api_key: geckoboard_api_key,
    data: gecko_text
  }

  this.geckoPush = function() {
    console.log(payload);
    request.post({url: geckoboard_widget_push_url,
      json: true,
      form: JSON.stringify(payload)},
      function(err, res, body) {
        if (err) {
          console.log(err);
        }
        console.log(body);
      }
    );
  }
}
module.exports=Geckoboard;
