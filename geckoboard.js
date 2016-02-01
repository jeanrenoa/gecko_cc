function Geckoboard() {
  var request = require('request');
  var payload_format = require('./payload.js');

  var logger = require('./logger');
  logger.debugLevel = 'release';

  //var geckoboard_widget_push_url = 'https://push.geckoboard.com/v1/send/152051-6d174582-9333-469d-b853-f0054067e524';
  var geckoboard_api_key = '320d6619216242dbebf256d24b24e6e2';

  var geckoboard_widget_push_url_Total_Forum_Posts = 'https://push.geckoboard.com/v1/send/156024-fb45fe78-c833-4f67-a521-14c3ea618d08';
  var geckoboard_widget_push_url_User_Distribution = 'https://push.geckoboard.com/v1/send/155162-d5fb05df-a6b2-4605-adba-47920ede488d';
  var geckoboard_widget_push_url_User_Feedback = 'https://push.geckoboard.com/v1/send/155162-1f320517-d4d1-40a1-a333-454b8b2366f2';
  var geckoboard_widget_push_url_Alpha1_x64_Download = 'https://push.geckoboard.com/v1/send/156024-7420556f-4d00-467a-89db-53457a9e1e54';
  var geckoboard_widget_push_url_Total_Project_Login = 'https://push.geckoboard.com/v1/send/156024-d354787b-f44f-4558-9870-f8afc881576a';
  var geckoboard_widget_push_url_Weekly_Alpha1_Download = 'https://push.geckoboard.com/v1/send/156024-59bf050f-1cf4-4c19-a7c2-060158d5fb30';
  var geckoboard_widget_push_url_Maestro_SP1_Beta1_x64_Download = 'https://push.geckoboard.com/v1/send/156024-c1fb98e5-515d-4a63-b19f-2981d9231ca5';
  var geckoboard_widget_push_url_Maestro_SP1_Beta1_x86_Download = 'https://push.geckoboard.com/v1/send/156024-e7ffb7fe-7ba6-4ac0-bd38-cc0981b16f5c';
  var geckoboard_widget_push_url_Total_Forum_Posts_Maestro_SP1_Beta1 = 'https://push.geckoboard.com/v1/send/156024-42da09e5-559d-43ae-8511-691e9f674cdb';
  var geckoboard_widget_push_url_Nautilus_Alpha2_x64_Download = 'https://push.geckoboard.com/v1/send/156024-a59059ca-827f-4b47-a35f-09ac27973d37';
  var geckoboard_widget_push_url_Nautilus_Alpha2_x86_Download = 'https://push.geckoboard.com/v1/send/156024-03bf5390-3cee-4ad9-ab64-c22d478e3c04';
  var geckoboard_widget_push_url_Maestro_SP1_Beta2_x86_Download = 'https://push.geckoboard.com/v1/send/156024-93ca66e3-cf0f-46bd-a23e-b047b2a1e4e0';
  var geckoboard_widget_push_url_Maestro_SP1_Beta2_x64_Download = 'https://push.geckoboard.com/v1/send/156024-d38a7f97-733a-4260-b26b-6fa9cef1663d';
  var geckoboard_widget_push_url_Weekly_Project_Login = 'https://push.geckoboard.com/v1/send/156024-38ac4ee0-1385-47dc-a0da-6db48a5abe75';
  var geckoboard_widget_push_url_Total_Forum_Posts_By_Tester = 'https://push.geckoboard.com/v1/send/156024-1a15f4b4-7e3a-49e9-beb4-4d97c858ee3e';
  var geckoboard_widget_push_url_Nautilus_Beta1_x64_Download = 'https://push.geckoboard.com/v1/send/156024-d62cb9e4-e647-41d5-896b-df44f8f83db5';
  var geckoboard_widget_push_url_Nautilus_Beta1_x86_Download = 'https://push.geckoboard.com/v1/send/156024-54178b61-2272-4253-8f2d-ab6e881853c5';
  var geckoboard_widget_push_url_Nautilus_Beta2_x64_Download = 'https://push.geckoboard.com/v1/send/156024-3c6486bf-441f-42e3-bc6e-c58768702fe6';
  var geckoboard_widget_push_url_Nautilus_Beta2_x86_Download = 'https://push.geckoboard.com/v1/send/156024-374b4140-49ca-4825-991b-0896d8579cd5';
  var geckoboard_widget_push_url_Nautilus_RC_Beta_x64_Download = 'https://push.geckoboard.com/v1/send/156024-0af94028-ec72-4a01-87e9-fe7930c3b846';
  var geckoboard_widget_push_url_Nautilus_RC_Beta_x86_Download = 'https://push.geckoboard.com/v1/send/156024-b8cafe16-7798-4cc6-bee0-d226a484b3b2';

  getvalue = function(val_current, val_pre, widget) {
    var res;

    switch (widget) {
      case "Total Forum Posts":
        if (val_pre != 0 && val_pre != undefined) {
          res = payload_format.gecko_number;
          res.item[0].value = val_current;
          res.item[1].value = val_pre;
        }
        else {
          res = payload_format.gecko_number1;
          res.item[0].value = val_current;
          res.item[0].text = "No data from last day";
        }
        break;
      case "User Distribution":
        res = payload_format.gecko_map;
        break;
      case "User Feedback":
        res = payload_format.gecko_linechart;
        break;
      case "Alpha1 64bit Download":
      case "Maestro SP1 Beta1 64bit Download":
      case "Maestro SP1 Beta1 32bit Download":
      case "Maestro SP1 Beta2 64bit Download":
      case "Maestro SP1 Beta2 32bit Download":
      case "Nautilus Alpha2 64bit Download":
      case "Nautilus Alpha2 32bit Download":
      case "Nautilus Beta1 64bit Download":
      case "Nautilus Beta1 32bit Download":
      case "Nautilus Beta2 64bit Download":
      case "Nautilus Beta2 32bit Download":
      case "Nautilus RC Beta 64bit Download":
      case "Nautilus RC Beta 32bit Download":
      case "Maestro SP1 Beta1 Forum Posts":
      case "Forum Post By Internal Tester":
        if (val_pre != 0 && val_pre != undefined) {
          res = payload_format.gecko_number;
          res.item[0].value = val_current;
          res.item[1].value = val_pre;
        }
        else {
          res = payload_format.gecko_number1;
          res.item[0].value = val_current;
          res.item[0].text = "No data from last day";
        }
        break;
      case "Total Project Login":
        res = payload_format.gecko_linechart;
        res.series[0].name = "Nautilus Alpha1";
        res.series[0].data = [];
        res.series[0].data = val_current;
        break;
      case "Weekly Alpha1 Download":
      case "Weekly Project Login":
        res = payload_format.gecko_bar;
        res.x_axis.labels = val_current[0].reverse();
        res.series[0].data =val_current[1].reverse();
        break;
      default:
        res = null;
    }
    logger.log('debug', 'Payload: ' + JSON.stringify(res));
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
      case "Total Project Login":
        geckoboard_widget_push_url = geckoboard_widget_push_url_Total_Project_Login;
        break;
      case "Weekly Alpha1 Download":
        geckoboard_widget_push_url = geckoboard_widget_push_url_Weekly_Alpha1_Download;
        break;
      case "Maestro SP1 Beta1 64bit Download":
        geckoboard_widget_push_url = geckoboard_widget_push_url_Maestro_SP1_Beta1_x64_Download;
        break;
      case "Maestro SP1 Beta1 32bit Download":
        geckoboard_widget_push_url = geckoboard_widget_push_url_Maestro_SP1_Beta1_x86_Download;
        break;
      case "Maestro SP1 Beta1 Forum Posts":
        geckoboard_widget_push_url = geckoboard_widget_push_url_Total_Forum_Posts_Maestro_SP1_Beta1;
        break;
      case "Maestro SP1 Beta2 32bit Download":
        geckoboard_widget_push_url = geckoboard_widget_push_url_Maestro_SP1_Beta2_x86_Download;
        break;
      case "Maestro SP1 Beta2 64bit Download":
        geckoboard_widget_push_url = geckoboard_widget_push_url_Maestro_SP1_Beta2_x64_Download;
        break;
      case "Nautilus Alpha2 64bit Download":
        geckoboard_widget_push_url = geckoboard_widget_push_url_Nautilus_Alpha2_x64_Download;
        break;
      case "Nautilus Alpha2 32bit Download":
        geckoboard_widget_push_url = geckoboard_widget_push_url_Nautilus_Alpha2_x86_Download;
        break;
      case "Weekly Project Login":
        geckoboard_widget_push_url = geckoboard_widget_push_url_Weekly_Project_Login;
        break;
      case "Forum Post By Internal Tester":
        geckoboard_widget_push_url = geckoboard_widget_push_url_Total_Forum_Posts_By_Tester;
        break;
      case "Nautilus Beta1 64bit Download":
        geckoboard_widget_push_url = geckoboard_widget_push_url_Nautilus_Beta1_x64_Download;
        break;
      case "Nautilus Beta1 32bit Download":
        geckoboard_widget_push_url = geckoboard_widget_push_url_Nautilus_Beta1_x86_Download;
        break;
      case "Nautilus Beta2 64bit Download":
        geckoboard_widget_push_url = geckoboard_widget_push_url_Nautilus_Beta2_x64_Download;
        break;
      case "Nautilus Beta2 32bit Download":
        geckoboard_widget_push_url = geckoboard_widget_push_url_Nautilus_Beta2_x86_Download;
        break;
      case "Nautilus RC Beta 64bit Download":
        geckoboard_widget_push_url = geckoboard_widget_push_url_Nautilus_RC_Beta_x64_Download;
        break;
      case "Nautilus RC Beta 32bit Download":
        geckoboard_widget_push_url = geckoboard_widget_push_url_Nautilus_RC_Beta_x86_Download;
        break;
      default:
        geckoboard_widget_push_url = '';
    }

    request.post({url: geckoboard_widget_push_url,
      json: true,
      form: JSON.stringify(payload)},
      function(err, res, body) {
        if (err) {
          logger.log('release', 'Push to Geckoboard: ' + JSON.stringify(err));
        }
        logger.log('release', 'Push to Geckoboard: ' + JSON.stringify(body));
      }
    );
  }
}
module.exports=Geckoboard;
