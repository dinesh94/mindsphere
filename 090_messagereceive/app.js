var express = require('express');
var app = express();
var cfenv = require("cfenv");
var appEnv = cfenv.getAppEnv();
var amqp = require("amqplib/callback_api");
var services = appEnv.getServices();
var connectionString = 'amqp://localhost';
var httpRequest = require('request');
var btoa = require('btoa');
var atob = require('atob');
var JWT = require('jwt-simple');


var port = appEnv.port || 3000;
var JWTtoken = '';

if (!appEnv.isLocal && process.env.hasOwnProperty('CONFIG') && services != undefined) {
  var cfg = JSON.parse(process.env.CONFIG);
  //console.log(services);

  if (cfg.hasOwnProperty('rabbitmqservice')) {
    // check for the name of your service instance within environment variables
    if (services.hasOwnProperty(cfg.rabbitmqservice)) {
      connectionString = services[cfg.rabbitmqservice].credentials.uri;
    }
  }

}


function getJwtToken(calllback, msg) {
  if (!appEnv.isLocal && process.env.hasOwnProperty('CONFIG')) {


    var cfg = JSON.parse(process.env.CONFIG);

    if (cfg.hasOwnProperty('clientSecret') && cfg.hasOwnProperty('clientId') && cfg.hasOwnProperty('securityServiceUrl')) {
      var clientSecret = cfg.clientSecret;
      var clientId = cfg.clientId;
      var securityServiceUrl = cfg.securityServiceUrl;

      var stringToEncode = clientId + ':' + clientSecret;


      var base64 = btoa(stringToEncode);

      console.log('stringToEncode:' + stringToEncode);
      console.log('secret:' + clientSecret);
      console.log('applicationId:' + clientId);
      console.log('securityServiceUrl:' + securityServiceUrl);
      console.log('base64:' + base64);

      var formdata = { grant_type: 'client_credentials' };

      //fetch JWT
      httpRequest.post({
        url: securityServiceUrl, headers: { 'Authorization': 'Basic ' + base64, 'accept': 'application/json', 'cache-control': 'no-cache', 'content-type': 'application/x-www-form-urlencoded' }, form: formdata
      }, function (error, answer, body) {
        if (!error) {

          if (answer.statusCode == 200) {
            var response = JSON.parse(body);
            console.log('Response: ' + body);

            if (response.access_token) {
              //console.log('AccessToken: ' + response.access_token);
              try {
                var decodedJWT = JWT.decode(response.access_token, null, true);
                console.log('decoded AccessToken: ' + JSON.stringify(decodedJWT));
              } catch (e) {
                console.log("error occured when decoding JWT", e);
              }
              calllback(response.access_token, msg);
            }
          }
          else {
            console.log('Error: ' + error);
          }
        }
        else {
          console.log('Error: ' + error);
        }
      });
    }
  }
}


function sendEmail(JWTtoken, message) {
  //console.log('JWTtoken: ' + JWTtoken);
  //console.log('message: ' + message);
  if (JWTtoken && message) {

    var message = {
      "body": {
        "message": message
      },
      "messageCategoryId": xx,
      "recipientsTo": ""
    };

    httpRequest.post({
      url: "https://gateway.eu1.mindsphere.io/api/notification/v3/publisher/messages",
      headers: {
        'Authorization': 'Bearer ' + JWTtoken,
        'Content-Type': 'application/json'
      },
      json: message
    }, function (error, answer, body) {
      if (!error) {

        console.log('statusCode from communication service: ' + answer.statusCode);
        if (answer.statusCode == 204) {
          console.log("E-mail was sent to :" + message.recipientsTo);
        }
        else {
          console.log('ERROR while sending e-mail! body: ' + body);
        }
      }
      else {
        console.log('ERROR while sending e-mail! error: ' + error);
      }
    }.bind(this)
    );
  }
  else console.log('Missing JWT or missing message content');
}



//Rabbit MQ receiver
if (connectionString) {
  console.log('connectionString: ' + connectionString);
  amqp.connect(connectionString, function (err, conn) {
    conn.createChannel(function (err, ch) {
      var q = 'email';

      ch.assertQueue(q, { durable: false });

      console.log("Waiting for messages in %s. To exit press CTRL+C", q);
      ch.consume(q, function (msg) {
        console.log("Received %s", msg.content.toString());
        getJwtToken(sendEmail, msg.content.toString());
      }, { noAck: true });

    });
  });
}

app.get("/", function (req, res, next) {
  res.end('Message Receiver');
});

app.listen(port, function () {
  console.log('server starting on ' + port);
});