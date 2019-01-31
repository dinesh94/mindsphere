var express = require('express');
var app = express();
var statusHandler = require('./status-handler');
var authMiddleware = require('./auth-middleware');
var configHandler = require('./config-handler');

var cfenv = require("cfenv");
var appEnv = cfenv.getAppEnv();

var port = appEnv.port || 3000;

// comment: /Status accessible without authentication
app.use('/Status', statusHandler);
// comment: middleware to check for authentication
app.use(authMiddleware.verifyReq);
// comment: /Config is only accessible if authentication via middleware was successful
app.use('/Config', configHandler);

app.listen(port, function() {   
    console.log('server starting on ' + port);
});