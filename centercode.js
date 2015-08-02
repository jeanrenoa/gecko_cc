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
        default:
          val = '?';
      }
      data = {};
      data[name] = val;
      results.push(console.log(data));
    }
    return results;
  };

  this.getData = function(data){
    // This is a export funtion
    soap.createClient('http://preview.beta.autodesk.com/cai/005/User.asmx?WSDL', function(err, client) {
      var viewFilterParams;
      viewFilterParams = {
        Access_Key: '505561556323453EA00E8B91BF930AEB',
        ProjectID: 'B4FC600EFC1B4586AD7185FD83476B6A',
        Context_User_ID: 'B394D280-6325-4D5B-A8D1-757011C121D4',
        ViewID: '57A03868-8604-409E-9356-C47D246FA2BF',
        CoreFilterID: '726CDB16-62D4-4DA3-815E-D4370BFC8F84',
        UserFilterID: '',
        Page_Number: -1,
        ShowZeroValues: true,
        CountOnly: false
      };
      return client.ProjectViewFilter(viewFilterParams, function(err, result, xmlData) {
        //console.log(result.ProjectViewFilterResult.Headers.Header);
        return processResult(result);
      });
    });
  }
}
module.exports=CenterCode;
