function Geckoboard() {
  var request = require('request');
  var payload_format = require('./payload.js');

  //var geckoboard_widget_push_url = 'https://push.geckoboard.com/v1/send/152051-6d174582-9333-469d-b853-f0054067e524';
  var geckoboard_api_key = '320d6619216242dbebf256d24b24e6e2';

  var geckoboard_widget_push_url_Total_Forum_Posts = 'https://push.geckoboard.com/v1/send/156024-fb45fe78-c833-4f67-a521-14c3ea618d08';
  var geckoboard_widget_push_url_User_Distribution = 'https://push.geckoboard.com/v1/send/155162-d5fb05df-a6b2-4605-adba-47920ede488d';
  var geckoboard_widget_push_url_User_Feedback = 'https://push.geckoboard.com/v1/send/155162-1f320517-d4d1-40a1-a333-454b8b2366f2';
  var geckoboard_widget_push_url_Alpha1_x64_Download = 'https://push.geckoboard.com/v1/send/156024-7420556f-4d00-467a-89db-53457a9e1e54';

  getvalue = function(val_current, val_pre, widget) {
    var res;

    switch (widget) {
      case "Total Forum Posts":
        res = payload_format.gecko_number;
        res.item[0].value = val_current;
        res.item[1].value = val_pre;
        console.log("payload:", res);
        break;
      case "User Distribution":
        res = payload_format.gecko_map;
        break;
      case "User Feedback":
        res = payload_format.gecko_linechart;
        break;
      case "Alpha1 64bit Download":
        res = payload_format.gecko_number;
        res.item[0].value = val_current;
        res.item[1].value = val_pre;
        console.log("payload:", res);
        break;
      default:
        res = null;
    }
    return res;
  }

  this.geckoPush = function(value_current, value_previous, widget) {
    var geckobaord_data = getvalue(value_current, value_previous, widget);
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
      case "Alpha1 64bit Download":
        geckoboard_widget_push_url = geckoboard_widget_push_url_Alpha1_x64_Download;
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
