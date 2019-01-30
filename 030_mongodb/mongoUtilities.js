(function() {
    "use strict";

    var mongojs = require('mongojs');
    var cfenv = require("cfenv");
    var appEnv = cfenv.getAppEnv();
    var services = appEnv.getServices();
    var connectionString = "mongodb://localhost/MyMongoDb";

    if (!appEnv.isLocal && process.env.hasOwnProperty('CONFIG') && services != undefined) {
        
        var cfg = JSON.parse(process.env.CONFIG);

        if (cfg.hasOwnProperty('mongoservice')) {
            if(services.hasOwnProperty(cfg.mongoservice)){
                connectionString = services[cfg.mongoservice].credentials.uri;
            }            
        }      
    }

    function onDatabaseError(err) {
        console.log('database error', err);
    }

    function onDatabaseConnection() {
        console.log('database connected');       
    }

    module.exports = {
        getDatabaseHandle: function() {
            var db = mongojs(connectionString, ['mycollection']);
            db.on('connect', onDatabaseConnection);
            db.on('error', onDatabaseError);
            return db;
        }
    };

})();
