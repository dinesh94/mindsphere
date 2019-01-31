var express = require('express');
var app = express();
var cfenv = require("cfenv");
var appEnv = cfenv.getAppEnv();


var port = appEnv.port || 6016;

app.use(express.static(__dirname));

app.listen(port, function() {   
    console.log('server starting on ' + port);
});