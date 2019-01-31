var JWT = require('jwt-simple');
var cfenv = require("cfenv");
var appEnv = cfenv.getAppEnv();
var httpRequest = require('request');
var btoa = require('btoa');
var atob = require('atob');


var port = appEnv.port || 6016;
var JWTtoken = '';
var Assets = {};

function getJwtToken(calllback) {
    if (!appEnv.isLocal && process.env.hasOwnProperty('CONFIG')) {


        var cfg = JSON.parse(process.env.CONFIG);

        if(cfg.hasOwnProperty('clientSecret') && cfg.hasOwnProperty('clientId') && cfg.hasOwnProperty('securityServiceUrl')){
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

            var formdata = {grant_type: 'client_credentials'};

            //fetch JWT
            httpRequest.post({
                url: securityServiceUrl, headers: {'Authorization': 'Basic ' + base64, 'accept':'application/json', 'cache-control':'no-cache', 'content-type':'application/x-www-form-urlencoded'}, form: formdata
            }, function(error, answer, body) {
                if(!error) {

                    if(answer.statusCode == 200) {
                        var response = JSON.parse(body);
                        console.log('Response: ' + body);

                        if(response.access_token){
                            console.log('AccessToken: ' + response.access_token);
                            try {
                                var decodedJWT = JWT.decode(response.access_token, null, true);
                                console.log('decoded AccessToken: ' + JSON.stringify(decodedJWT));
                            }catch(e){
                                console.log("error occured when decoding JWT", e);
                            }
                            calllback(response.access_token);
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


function fetchAssets(JWTtoken) {
    httpRequest.get({
            url: 'https://gateway.eu1.mindsphere.io/api/assetmanagement/v3/assets?size=100', headers: {'Authorization': 'Bearer ' + JWTtoken}
            }, function(error, answer, body) {
            if(!error) {
                var response = JSON.parse(body);
                console.log('Fetch Assets Success: ',response);
            }
            else {
                console.log('Fetch Assets Error: ' + error);
            }
        }.bind(this)
    );
};

setInterval(function(){getJwtToken(fetchAssets)}, 10000);
