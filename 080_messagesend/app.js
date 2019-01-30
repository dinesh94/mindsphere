var express = require('express');
var app = express();
var cfenv = require("cfenv");
var appEnv = cfenv.getAppEnv();
var amqp = require("amqplib/callback_api");
var services = appEnv.getServices();
var connectionString = 'amqp://localhost';

var port = appEnv.port || 3000;

if (!appEnv.isLocal && process.env.hasOwnProperty('CONFIG') && services != undefined) {
    var cfg = JSON.parse(process.env.CONFIG);
    //console.log(services);

    if (cfg.hasOwnProperty('rabbitmqservice')) {
        // check for the name of your service instance within environment variables
        if(services.hasOwnProperty(cfg.rabbitmqservice)) {
            connectionString = services[cfg.rabbitmqservice].credentials.uri;
        }
    }
}

function sendMessage(name) {

    if(connectionString){
        console.log('connectionString: ' + connectionString);
        amqp.connect(connectionString, function(err, conn) {

            if(err) console.log('error creating channel: ' + err);

            conn.createChannel(function(err, ch) {

                if(err) console.log('error creating channel: ' + err);

                if(ch) {
                    console.log("channel created");
                    var q = 'email';
                    ch.assertQueue(q, {durable: false});
                    ch.sendToQueue(q, new Buffer('Hello ' + name));
                }
            });
            setTimeout(function() { conn.close();}, 500);
        });
    }
}

app.get("/", function(req, res, next) {
    res.end('Message Sender');
});

app.get("/Send", function(req, res, next) {

    if(req.query.name){
        console.log("message sending triggered");
        sendMessage(req.query.name);
        res.end('message \'Hello ' + req.query.name + '\' sended to E-mail Buffer');
    }
    else res.end('invalid \'name\' parameter. No message was sent');
});

app.listen(port, function() {   
    console.log('server starting on ' + port);
});