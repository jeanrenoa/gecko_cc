function Geckoboard() {
  var request = require('request');
  var payload_format = require('./payload.js');

  //var geckoboard_widget_push_url = 'https://push.geckoboard.com/v1/send/152051-6d174582-9333-469d-b853-f0054067e524';
  var geckoboard_api_key = '8c46bf5a67b823e858c8797fc3966871';

  var geckoboard_widget_push_url_Total_Forum_Posts = 'https://push.geckoboard.com/v1/send/155162-364ca507-d620-4c11-89ae-09177e50fdde';
  var geckoboard_widget_push_url_User_Distribution = 'https://push.geckoboard.com/v1/send/155162-d5fb05df-a6b2-4605-adba-47920ede488d';
  var geckoboard_widget_push_url_User_Feedback = 'https://push.geckoboard.com/v1/send/155162-1f320517-d4d1-40a1-a333-454b8b2366f2';

  getvalue = function(val, widget) {
    var res;

    switch (widget) {
      case "Total Forum Posts":
        res = payload_format.gecko_number;
        res.item[0].value = val[1]['# of Total User Forum Posts'];
        console.log("payload:", res);
        break;
      case "User Distribution":
        res = payload_format.gecko_map;
        break;
      case "User Feedback":
        res = payload_format.gecko_linechart;
        break;
      default:
        res = null;
    }

/*  var gecko_number = {
      "item": [
        {
          "value": val[1]['# of Total User Forum Posts'],
          "text": "Total User Forum Posts"
        },
        {
          "value": 6000
        }
      ]
    }
*/
    return res;
  }

  this.geckoPush = function(value_gecko, widget) {
    var geckobaord_data = getvalue(value_gecko, widget);
    var payload = {
      api_key: geckoboard_api_key,
      data: geckobaord_data
    }

    var geckoboard_widget_push_url;
    switch (widget) {
      case "Total Forum Posts":
        geckoboard_widget_push_url = geckoboard_widget_push_url_Total_Forum_Posts;
        break;
      case "User Distribution":
        geckoboard_widget_push_url = geckoboard_widget_push_url_User_Distribution;
        break;
      case "User Feedback":
        geckoboard_widget_push_url = geckoboard_widget_push_url_User_Feedback;
        break;
      default:
        geckoboard_widget_push_url = '';
    }

    request.post({url: geckoboard_widget_push_url,
      json: true,
      form: JSON.stringify(payload)},
      function(err, res, body) {
        if (err) {
          console.log("Push to Geckoboard:", err);
        }
        console.log("Push to Geckoboard:", body);
      }
    );
  }
}
module.exports=Geckoboard;
