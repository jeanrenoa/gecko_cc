// JSON format to push data to Geckoboard
exports.gecko_text = {
  "item": [
    {
      "text": "production-web-1: NOT RESPONDING",
      "type": 1
    }
  ]
}

/*
// Linechart sample
exports.gecko_linechart = {
  "x_axis": {
    "labels": [
      "Jan", "Feb", "Mar", "Apr",
      "May", "Jun", "Jul", "Aug",
      "Sep", "Oct", "Nov", "Dec"
    ]
  },
  "series": [
    {
      "name": "Maestro",
      "data": [
        1.62529, 1.56991, 1.50420, 1.52265,
        1.55356, 1.51930, 1.52148, 1.51173,
        1.55170, 1.61966, 1.59255, 1.63762
      ]
    },
    {
      "name": "Nautilus",
      "data": [
        1.23226, 1.15025, 1.15501, 1.18526,
        1.18137, 1.16923, 1.16434, 1.14420,
        1.17542, 1.19759, 1.18098, 1.20513
      ]
    }
  ]
}
*/

exports.gecko_linechart = {
  "x_axis": {
    "type": "datetime"
  },
  "series": [
    {
      "name": "",
      "data": []
    }
  ]
}

exports.gecko_map = {
  "points": {
    "point": [
      {
        "city": {
          "city_name": "London",
          "country_code": "GB"
        },
        "size": 10
      },
      {
        "city": {
          "city_name": "San Francisco",
          "country_code": "US",
          "region_code": "CA"
        }
      }
    ]
  }
}

exports.gecko_number = {
  "item": [
    {
      "value": 0,
      "text": "Please fill in text"
    },
    {
      "value": 0
    }
  ]
}
