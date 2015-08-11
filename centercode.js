function CenterCode() {
  // Pull data from CenterCode
  var getFieldNames, processResult, should, soap;

  should = require('should');
  soap = require('soap');

  getFieldNames = function(headers) {
    var reducer;
    headers = headers != null ? headers.Header : void 0;
    should.exist(headers);
    reducer = function(result, header) {
      var name, ordinal;
      ordinal = header.attributes.Field_Ordinal;
      name = header.attributes.Field_Name;
      result.should.not.have.property(ordinal);
      result[ordinal] = name;
      return result;
    };
    return headers.reduce(reducer, {});
  };

  processResult = function(result) {
    var data, fieldNames, i, len, name, ref, results, val, value;
    fieldNames = getFieldNames(result.ProjectViewFilterResult.Headers);
    //console.log(fieldNames);
    ref = result.ProjectViewFilterResult.Values.Value.slice(1);
    results = [];
    for (i = 0, len = ref.length; i < len; i++) {
      value = ref[i];
      name = fieldNames[value.attributes.Field_Ordinal];
      val = '';
      switch (value.attributes.Value_Type) {
        case 'string':
          val = value.attributes.String_Value;
          break;
        case 'int':
          val = value.attributes.Int_Value;
          break;
        default:
          val = '?';
      }
      data = {};
      data[name] = val;
      //results.push(console.log(data));
      console.log(data);
      results.push(data);
    }
    return results;
  };

  this.getData = function(url, viewFilterParams, callback){
    // This is a export funtion
    soap.createClient(url, function(err, client) {
      client.ProjectViewFilter(viewFilterParams, function(err, result, xmlData) {
        console.log("result:", result);
        var data = [];
        data = processResult(result);
        callback(data);
      });
    });
  }
}
module.exports=CenterCode;
