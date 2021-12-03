const AWS = require('aws-sdk')


const Polly = new AWS.Polly()
const s3 = new AWS.S3();

const bucketName = "mamago-polly-translate"
const keyName = "tts.mp3"


exports.handler = function(event, context, callback) {

    console.log(JSON.stringify(event.body));

    const response = JSON.parse(event.body)


    try {
        let pollyparams = {
            'Text': response.text,
            'TextType': "text",
            'OutputFormat': 'mp3',
            'VoiceId': response.voice
        }

        Polly.synthesizeSpeech(pollyparams, function(err, data) {
            if (err) callback(err)
            else if (data) {
                let s3params = {
                    Body: data.AudioStream,
                    Bucket: bucketName,
                    Key: keyName,
                    ACL: "bucket-owner-full-control"
                };


                s3.putObject(s3params, function(err, data) {
                    if (err) {
                        console.log(err, err.stack);
                        callback(err)
                    }
                    else {
                        callback(null, {
                            statusCode: 200,
                            headers: {
                                "Access-Control-Allow-Origin": "*",
                                "Access-Control-Allow-Credentials": true
                            },
                            body: 'https://'+bucketName+'.s3.ap-northeast-2.amazonaws.com/'+keyName
                        })
                        console.log(data.Location);
                    }
                });
            }
        })
    }
    catch (e) {
        callback(null, {
            statusCode: 200,
            body: JSON.stringify(e)
        })
    }

}