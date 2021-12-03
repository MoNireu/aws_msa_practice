var AWS = require('aws-sdk');

AWS.config.update({region: 'ap-northeast-2'});

var translate = new AWS.Translate();
exports.handler = function(event, context,callback){

console.log(JSON.stringify(event.body));

const response = JSON.parse(event.body)


  try{
    const translateParams = {
    SourceLanguageCode: response.from,
    TargetLanguageCode: response.to,
    Text: response.text
  }


  translate.translateText(translateParams, function (err, data) {
    if (err) callback(err)
    
    callback(null,{
        statusCode:200,
        headers: {
        "Access-Control-Allow-Origin" : "*", //S3에서 요청을 할 수 있도록 허용해줍니다.
        "Access-Control-Allow-Credentials" : true
        },
        body:data.TranslatedText
    })
  })
  }catch(e){
    callback(null,{
      statusCode:200,
      body:JSON.stringify(e)
    })
  }


};
